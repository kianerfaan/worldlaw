// API endpoint
const API_ENDPOINT = 'https://api.worldlaw.ai/query';

// DOM element references
const chatbox = document.getElementById('chatbox');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const exampleQueries = document.getElementById('example-queries');

// Initialize the application
function init() {
    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });
    exampleQueries.addEventListener('click', handleExampleQuery);
}

// Handle user input
async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage(userMessage, true);
        userInput.value = '';
        
        try {
            showLoadingIndicator();
            const botResponse = await callRAGSystem(userMessage);
            hideLoadingIndicator();
            addMessage(botResponse);
        } catch (error) {
            handleError(error);
        }
    }
}

// Handle example query clicks
function handleExampleQuery(event) {
    if (event.target.classList.contains('example-query')) {
        userInput.value = event.target.textContent;
        handleUserInput();
    }
}

// Call the RAG system
async function callRAGSystem(query) {
    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response;
}

// Add a message to the chatbox
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = isUser ? message : marked(message);
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Show loading indicator
function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.textContent = 'Thinking...';
    chatbox.appendChild(loadingDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Hide loading indicator
function hideLoadingIndicator() {
    const loadingDiv = document.getElementById('loading-indicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Handle errors
function handleError(error) {
    console.error('Error:', error);
    addMessage('An error occurred. Please try again later.');
    hideLoadingIndicator();
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', init);
