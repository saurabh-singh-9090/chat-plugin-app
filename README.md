# AI Chat Interface with Plugin-Style Tools

This project implements an AI-powered chatbot interface that supports a plugin-style system for enhanced functionality. Users can type natural messages or slash commands (like `/weather Paris`), and the interface will parse commands and show dynamic responses from different plugins.

## Features

- **Chat UI**: Scrollable chat history with user and assistant messages
- **Plugin Commands**: Supports slash commands and natural language parsing
- **Implemented Plugins**:
  - `/weather [city]`: Fetches current weather data
  - `/calc [expression]`: Evaluates mathematical expressions
  - `/define [word]`: Fetches dictionary definitions
- **Natural Language Parsing**: Understands queries like "What's the weather in Tokyo?"
- **History & Persistence**: Chat history is stored in localStorage

## Setup and Running

1. Clone the repository
2. Install dependencies:
