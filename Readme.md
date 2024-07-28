# Text Analyzer Project

This project consists of three main components: an API Gateway, a Fast Auth Server, and a Text Analyzer API. It uses a microservices architecture with Docker for containerization.

## Project Structure

- `api-gateway`: Nginx-based API gateway (submodule)
- `fast-auth-server`: Authentication server (submodule)
- `text-analyzer-api`: Main application for text analysis

## Prerequisites

- Docker and Docker Compose
- Git (for cloning submodules)

## Setup and Running

1. Clone the repository with submodules: ```git clone --recurse-submodules [YOUR_REPOSITORY_URL]```
2. If you've already cloned the project without submodules, initialize them: ```git submodule update --init --recursive```
3. Create a `.env` file in the root directory and add necessary environment variables.
4. Build and run the services: ```docker compose up --build```
5. The services should now be running:
  - API Gateway: http://localhost:80
  - Auth Server: http://localhost:6969
  - Text Analyzer API: http://localhost:3000

## API and Services Overview

### API Gateway (Nginx)
- Routes requests to appropriate services
- Handles authentication via the Fast Auth Server
- Manages CORS and other cross-cutting concerns

### Fast Auth Server
- Manages user authentication
- Provides endpoints for login, logout, and token refresh
- Uses JWT for secure token-based authentication

### Text Analyzer API
- Provides text analysis functionalities
- Protected routes require authentication
- Main endpoints:
- POST /api/texts: Create a new text analysis
- GET /api/texts/{id}: Retrieve a specific text analysis
- PUT /api/texts/{id}: Update an existing text analysis
- DELETE /api/texts/{id}: Delete a text analysis
- GET /api/texts/{id}/analysis: Get detailed analysis for a text

### RUN THE APIS
Import the postman collection to postman and try it out after booting up the services

## Development

To work on individual components:

1. Navigate to the submodule directory: ```cd [submodule-name]```
2. Follow the README instructions in each submodule for specific development guidelines.
3. After making changes, commit them in the submodule repository.
4. Update the main project to use the new submodule commit: ```git add [submodule-name] && git commit -m "Update submodule"``` 
## Troubleshooting

If you encounter issues:
- Ensure all submodules are properly initialized and updated
- Check Docker and Docker Compose are installed and running correctly
- Verify all required environment variables are set in the .env file

For more detailed information, refer to the README files in each submodule.