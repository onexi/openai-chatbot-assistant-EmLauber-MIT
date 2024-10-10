// Function to update the assistant info displayed on the page
function updateAssistantInfo(assistantId, assistantName) {
    const assistantIdField = document.getElementById('assistant_id');
    const assistantNameField = document.getElementById('assistant_name');
    const threadIdField = document.getElementById('thread_id');
    const newThreadButton = document.getElementById('newThreadButton');
    const askAssistantButton = document.querySelector('button[type="submit"]');
  
    // Update the assistant details on the webpage
    assistantIdField.textContent = assistantId;
    assistantNameField.textContent = assistantName;
  
    // Enable the New Thread button if assistant ID and name are populated
    if (assistantId && assistantName) {
      newThreadButton.disabled = false; // Enable the button
      newThreadButton.classList.remove('btn-secondary');
      newThreadButton.classList.add('btn-primary'); // Change to primary button style
      askAssistantButton.disabled = true; // Disable Ask Assistant until a thread is created
      document.getElementById('user_prompt').disabled = true; // Disable input until a thread is created
    }
  }
  
  // Function to handle the selection of an assistant from the modal
  function selectAssistant(assistantId, assistantName) {
    fetch('/api/selectAssistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assistant_id: assistantId })
    })
      .then(response => response.json())
      .then(data => {
        updateAssistantInfo(data.assistant_id, data.assistant_name); // Update the assistant info on the page
        closeModal(); // Close the modal after selection
      })
      .catch(error => console.error('Error selecting assistant:', error));
  }
  
  // Function to handle the form submission for asking a question
  document.getElementById('assistantForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const user_prompt = document.getElementById('user_prompt').value;
    const response = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: user_prompt })
    });
  
    const result = await response.json();
  
    if (result.messages) {
      const chatWindow = document.getElementById('chatMessages');
      chatWindow.innerHTML = ''; // Clear previous conversation
  
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
  });
  
  // Function to handle new thread creation
  document.getElementById('newThreadButton').addEventListener('click', async function() {
    const response = await fetch('/api/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
  
    const result = await response.json();
    if (result.threadId) {
      console.log('New thread created:', result.threadId);
      document.getElementById('chatMessages').innerHTML = ''; // Clear chat window
      document.getElementById('thread_id').textContent = result.threadId; // Update Thread ID display
      document.querySelector('button[type="submit"]').disabled = false; // Enable Ask Assistant button
      document.getElementById('user_prompt').disabled = false; // Enable user input
    } else {
      console.error(result.error);
    }
  });
  
  // Function to open the assistant selection modal and fetch assistants
  document.getElementById('selectAssistantButton').addEventListener('click', function() {
    fetch('/api/assistants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    })
      .then(response => response.json())
      .then(assistants => {
        const assistantList = document.getElementById('assistantList');
        assistantList.innerHTML = ''; // Clear existing list
  
        assistants.forEach(assistant => {
          const assistantItem = document.createElement('li');
          assistantItem.textContent = assistant.name;
          assistantItem.onclick = function() {
            selectAssistant(assistant.id, assistant.name); // Select assistant on click
          };
          assistantList.appendChild(assistantItem);
        });
  
        // Show the modal
        $('#assistantModal').modal('show'); // Use jQuery to show the modal
      })
      .catch(error => console.error('Error fetching assistants:', error));
  });
  
  // Function to close the modal
  function closeModal() {
    $('#assistantModal').modal('hide'); // Use jQuery to hide the modal
  }
  