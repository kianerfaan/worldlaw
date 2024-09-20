// 1. Set up the back-end API endpoint
const API_ENDPOINT = 'https://api.worldlaw.ai/query';

// 2. Modify the handleUserInput function
async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (userMessage) {
        addMessage(userMessage, true);
        userInput.value = '';
        
        try {
            // Show loading indicator
            showLoadingIndicator();
            
            // Call the RAG system
            const botResponse = await callRAGSystem(userMessage);
            
            // Hide loading indicator
            hideLoadingIndicator();
            
            // Display the response
            addMessage(botResponse);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, there was an error processing your request. Please try again.');
        }
    }
}

// 3. Implement the RAG system call
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

// 4. Implement loading indicator functions
function showLoadingIndicator() {
    // Add a loading message or spinner to the chat
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.textContent = 'Thinking...';
    chatbox.appendChild(loadingDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function hideLoadingIndicator() {
    // Remove the loading indicator
    const loadingDiv = document.getElementById('loading-indicator');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// 5. Error handling
function handleError(error) {
    console.error('Error:', error);
    addMessage('An error occurred. Please try again later.');
}

// 6. Update the script section in your HTML
// <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
// <script src="app.js"></script>

// 7. In app.js, update the addMessage function to support markdown
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    // Use marked to render markdown
    messageDiv.innerHTML = isUser ? message : marked(message);
    
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}
