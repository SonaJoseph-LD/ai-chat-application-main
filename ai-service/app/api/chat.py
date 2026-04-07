import re
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.llm import call_llm_api
from app.core.tools import AVAILABLE_TOOLS
from app.core.rag import _rag

router = APIRouter()

class ChatRequest(BaseModel):
    user_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

# Stricter, Few-Shot Prompt for the Agent
AGENT_SYSTEM_PROMPT = """You are a helpful Agentic AI. You MUST follow this format strictly.

TOOLS AVAILABLE:
- search_memories(query): For past user history.
- web_search(query): For current weather, news, or general facts.
- get_time(): For current date/time.

RULES:
1. If you need a tool, output ONLY the action line.
2. If you have the info, output ONLY the answer line.

EXAMPLES:
User: What is the weather?
ACTION: web_search("current weather")

User: What did I say my name was?
ACTION: search_memories("user name")

User: Hello!
ANSWER: Hello! How can I help you today?

User: {message}
"""

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        # 1. Store the message for future memory
        _rag.store_message_embedding(request.user_id, request.message)

        # 2. Reasoning Phase
        prompt = AGENT_SYSTEM_PROMPT.format(message=request.message)
        ai_output = await call_llm_api(prompt)
        print(f"🤖 Agent Thought: {ai_output}")

        # Clean the output (sometimes models add extra text)
        # Look for the LAST occurrence of ACTION: or ANSWER:
        action_match = re.search(r'ACTION:\s*(\w+)\((.*)\)', ai_output, re.IGNORECASE)
        answer_match = re.search(r'ANSWER:\s*(.*)', ai_output, re.IGNORECASE | re.DOTALL)

        if action_match:
            tool_name = action_match.group(1).lower().strip()
            tool_query = action_match.group(2).strip('"').strip("'")
            
            if tool_name in AVAILABLE_TOOLS:
                # 3. Execution Phase
                print(f"🔧 Calling Tool: {tool_name} with '{tool_query}'")
                if tool_name == "search_memories":
                    tool_result = AVAILABLE_TOOLS[tool_name](request.user_id, tool_query)
                else:
                    tool_result = AVAILABLE_TOOLS[tool_name](tool_query)
                
                # 4. Final Answer Phase
                final_prompt = f"{prompt}\nTOOL RESULT: {tool_result}\nNow give the final ANSWER."
                final_response = await call_llm_api(final_prompt)
                
                # Clean up "ANSWER:" prefix if LLM added it again
                if "ANSWER:" in final_response:
                    final_response = final_response.split("ANSWER:")[1].strip()
            else:
                final_response = f"I tried to use a tool called '{tool_name}' but it doesn't exist. Directly: {ai_output}"
        
        elif answer_match:
            final_response = answer_match.group(1).strip()
        else:
            # Fallback if the model didn't use the format
            final_response = ai_output.replace("ANSWER:", "").strip()

        return ChatResponse(response=final_response)

    except Exception as e:
        print(f"🚨 Agent Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
