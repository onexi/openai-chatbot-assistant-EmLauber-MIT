// script.js

// Initial Assistant Info (hardcoded for now)
const assistantId = 'asst_mKubPnoRJxz3sL90FRE9NEZH';
const assistantName = 'AI Assistant';

// Display Assistant ID and Name
document.getElementById('assistantId').textContent = assistantId;
document.getElementById('assistantName').textContent = assistantName;

// Function to disable buttons and change the button text
function toggleButtons(disable, buttonText = '') {
  const newThreadButton = document.getElementById('newThreadButton');
  const askAssistantButton = document.querySelector('button[type="submit"]');
  
  newThreadButton.disabled = disable;
  askAssistantButton.disabled = disable;

  // Change the button text if requested
  if (buttonText) {
    askAssistantButton.textContent = buttonText;
  } else {
    askAssistantButton.textContent = 'Ask Assistant'; // Reset to original text
  }
}

document.getElementById('assistantForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  toggleButtons(true, 'Asking...'); // Disable buttons and change text

  const user_prompt = document.getElementById('user_prompt').value;

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

  // Clear input field
  document.getElementById('user_prompt').value = '';

  toggleButtons(false); // Re-enable buttons and reset text
});

document.getElementById('newThreadButton').addEventListener('click', async function() {
  toggleButtons(true); // Disable buttons

  const response = await fetch('/api/threads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

  const result = await response.json();
  if (result.threadId) {
    console.log('New thread created:', result.threadId);
    document.getElementById('chatMessages').innerHTML = ''; // Clear chat window

    // Update the thread ID on the page
    document.getElementById('threadId').textContent = result.threadId;

    // Ensure Assistant ID is displayed correctly
    document.getElementById('assistantId').textContent = assistantId; // Just to ensure
  } else {
    console.error(result.error);
  }

  toggleButtons(false); // Re-enable buttons
});
