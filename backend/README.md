# AI Chat Application Backend

This is the backend service for the AI Chat Application, built using Spring Boot. It provides RESTful APIs for user authentication, conversation management, and message handling.

## Features

- User registration and login with JWT authentication
- Create and manage conversations
- Send messages and receive AI responses
- Integration with an AI service for generating responses

## Project Structure

```
backend
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── chat
│   │   │               ├── ChatApplication.java
│   │   │               ├── config
│   │   │               │   ├── JwtConfig.java
│   │   │               │   └── SecurityConfig.java
│   │   │               ├── controller
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── ConversationController.java
│   │   │               │   └── MessageController.java
│   │   │               ├── entity
│   │   │               │   ├── Conversation.java
│   │   │               │   ├── Message.java
│   │   │               │   └── User.java
│   │   │               ├── repository
│   │   │               │   ├── ConversationRepository.java
│   │   │               │   ├── MessageRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               ├── service
│   │   │               │   ├── AuthService.java
│   │   │               │   ├── ConversationService.java
│   │   │               │   ├── MessageService.java
│   │   │               │   └── AiClient.java
│   │   │               └── web
│   │   │                   └── dto
│   │   │                       ├── AuthDtos.java
│   │   │                       ├── ConversationDtos.java
│   │   │                       └── MessageDtos.java
│   │   └── resources
│   │       └── application.yml
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── chat
│                       └── ChatApplicationTests.java
├── pom.xml
└── README.md
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd ai-chat-rag-starter/backend
   ```

2. **Build the project:**
   ```
   ./mvnw clean install
   ```

3. **Run the application:**
   ```
   ./mvnw spring-boot:run
   ```

4. **Configuration:**
   Update the `src/main/resources/application.yml` file with your database and JWT settings.

5. **API Endpoints:**
   - `POST /auth/register`: Register a new user
   - `POST /auth/login`: Authenticate a user
   - `GET /conversations`: Retrieve all conversations for the authenticated user
   - `POST /conversations`: Create a new conversation
   - `GET /messages/{conversationId}`: Retrieve messages for a specific conversation
   - `POST /messages`: Send a new message

## Dependencies

- Spring Boot
- Spring Security
- JPA/Hibernate
- PostgreSQL Driver

## Testing

Run the tests using:
```
./mvnw test
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.