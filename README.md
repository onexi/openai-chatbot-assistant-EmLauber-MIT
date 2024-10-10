[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ZjtTJ8eb)

# Em's PS03OpenAIAssistantChatBot

## Overview

Em's AI Assistant Application is a web-based interface that allows users to interact with various AI assistants available to the user given their OpenAI API Key. The application provides functionalities to select an assistant, create conversation threads, and submit queries. It is built using Node.js, Express, and Bootstrap for the front end.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [File Structure](#file-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Select Assistant**: Users can choose from a list of available AI assistants.
- **Create New Thread**: Users can start a new conversation thread with the selected assistant.
- **Ask Questions**: Users can submit questions to the assistant and view responses in real time.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework for building web applications in Node.js.
- **Bootstrap**: CSS framework for responsive web design.
- **JavaScript**: For client-side scripting and DOM manipulation.

## Getting Started

### Prerequisites

- Node.js installed on your machine.

### Adding your OPENAI_API_KEY

You must add a .env file with your own OPENAI_API_KEY.

The .env setup should look like 
OPENAI_API_KEY=<add your key here>

The .gitignore file will prevent pushing this .env file to the repo.

### Running the Application

1. Start the server:
   ```bash
   node server.js
   ```
2. Open your web browser and go to `http://localhost:3000` to access the application.

## File Structure

```
/openai-chatbot-assistant-EmLauber-MIT
│
├── server.js          # Main server file handling API routes and logic.
├── index.html         # Frontend HTML file with UI elements.
├── script.js          # JavaScript file for client-side interactions.
├── package.json       # Node.js project metadata and dependencies.
└── README.md          # Project overview and documentation.
```

## Usage

1. **Select Assistant**: Click on the "Select Assistant" button to open the modal and choose an assistant from the list.
2. **Create New Thread**: Once an assistant is selected, click "New Thread" to start a new conversation.
3. **Ask Questions**: Enter your question in the provided input field and click the "Ask Assistant" button to receive responses.
4. **View Conversations**: All messages will be displayed in the conversation window.
