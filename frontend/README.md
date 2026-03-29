# AI Chat Application (RAG) - Frontend

This is the frontend part of the AI Chat Application built using Next.js, TypeScript, and Tailwind CSS. The application allows users to chat with an AI model, manage conversations, and maintain context memory.

## Features

- User authentication (registration and login)
- Chat interface with streaming responses
- Conversation history and management
- Context memory using Retrieval-Augmented Generation (RAG)

## Tech Stack

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, React Query
- **Backend**: Java Spring Boot
- **AI Service**: Python FastAPI

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm (Node Package Manager)
- PostgreSQL (for backend)
- Docker (optional, for running services)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd ai-chat-rag-starter/frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

### Running the Application

To run the frontend application in development mode, use:

```
npm run dev
```

This will start the Next.js development server. You can access the application at `http://localhost:3000`.

### Building for Production

To build the application for production, run:

```
npm run build
```

Then, you can start the production server with:

```
npm start
```

### Environment Variables

Make sure to set up the necessary environment variables for connecting to the backend and AI service. You can create a `.env.local` file in the root of the frontend directory and add your variables there.

### Folder Structure

- `src/app`: Contains the main application pages.
- `src/components`: Contains reusable components.
- `src/lib`: Contains utility functions for API calls and authentication.
- `src/types`: Contains TypeScript types and interfaces.

## Contributing

Feel free to submit issues or pull requests. Contributions are welcome!

## License

This project is licensed under the MIT License. See the LICENSE file for more details.