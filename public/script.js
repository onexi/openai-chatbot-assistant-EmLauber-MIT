// script.js

document.getElementById('assistantForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const user_prompt = document.getElementById('user_prompt').value;

    // Disable the Ask Assistant button and show loading state
    const askAssistantButton = document.getElementById('askAssistantButton');
    askAssistantButton.textContent = 'Loading...';
    askAssistantButton.disabled = true;

    const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: user_prompt })
    });

    const result = await response.json();

    if (result.messages) {
        // Display the conversation
        const chatWindow = document.getElementById('chatMessages');
        chatWindow.innerHTML = '';  // Clear previous conversation

        result.messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.textContent = `${message.role}: ${message.content}`;
            messageDiv.style.color = message.role === 'user' ? 'lightgreen' : 'lightblue';
            chatWindow.appendChild(messageDiv);
        });
    } else {
        console.error(result.error);
    }

    // Clear input field and reset button
    document.getElementById('user_prompt').value = '';
    askAssistantButton.textContent = 'Ask Assistant';
    askAssistantButton.disabled = false; // Re-enable the button
});

document.getElementById('newThreadButton').addEventListener('click', async function() {
    // Disable the New Thread button while creating the thread
    const newThreadButton = document.getElementById('newThreadButton');
    newThreadButton.disabled = true;

    const response = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });

    const result = await response.json();
    if (result.threadId) {
        console.log('New thread created:', result.threadId);
        document.getElementById('chatMessages').innerHTML = ''; // Clear chat window
        
        // Update the Thread ID display
        document.getElementById('threadId').textContent = result.threadId;
        
        // Enable the Ask Assistant button after creating a thread
        document.getElementById('askAssistantButton').disabled = false;
    } else {
        console.error(result.error);
    }

    // Re-enable the New Thread button
    newThreadButton.disabled = false;
});

document.getElementById('chooseAssistantButton').addEventListener('click', function() {
    // Clear the assistant list before fetching new assistants
    const assistantList = document.getElementById('assistantList');
    assistantList.innerHTML = ''; // Clear previous options

    // Fetch the list of assistants and populate the modal
    fetch('/api/assistants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(assistant => {
            const button = document.createElement('button');
            button.className = 'btn btn-light m-1';
            button.textContent = assistant.name; // Assuming assistant has a name property
            button.onclick = async () => {
                // Send selected assistant to server
                const response = await fetch('/api/selectAssistant', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ assistant_id: assistant.id }) // Send assistant ID to server
                });

                if (response.ok) {
                    const updatedState = await response.json();
                    
                    // Update Assistant ID and Name display on the webpage
                    document.getElementById('assistantId').textContent = updatedState.assistant_id;
                    document.getElementById('assistantName').textContent = updatedState.assistant_name;

                    // Close the modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('assistantModal'));
                    modal.hide();
                } else {
                    console.error('Error selecting assistant:', await response.json());
                }
            };
            assistantList.appendChild(button);
        });
    })
    .catch(error => {
        console.error('Error fetching assistants:', error);
    });

    // Show the modal
    const modal = new bootstrap.Modal(document.getElementById('assistantModal'));
    modal.show();
});

