import datetime
from app.core.rag import retrieve_relevant_context
from app.core.embeddings import generate_embedding

def tool_search_memories(user_id: str, query: str):
    """Searches the local FAISS database for past conversation context."""
    print(f"🔧 Tool Call: search_memories('{query}')")
    embedding = generate_embedding(query)
    context = retrieve_relevant_context(user_id, embedding)
    return context if context else "No relevant past memories found."

def tool_web_search(query: str):
    """Simulates a live web search for current events or general facts."""
    print(f"🔧 Tool Call: web_search('{query}')")
    # Mock data for demonstration
    if "weather" in query.lower():
        return "The current weather is 22°C and sunny."
    if "bitcoin" in query.lower() or "price" in query.lower():
        return "The simulated current price of Bitcoin is $65,432.10."
    return f"Search result for '{query}': This is a simulated live result from the web."

def tool_get_time(query: str):
    """Returns the current date and time."""
    return f"The current time is {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}."

# Dictionary of available tools
AVAILABLE_TOOLS = {
    "search_memories": tool_search_memories,
    "web_search": tool_web_search,
    "get_time": tool_get_time
}
