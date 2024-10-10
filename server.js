import express from 'express';
import { OpenAI } from 'openai';

import 'dotenv/config';  // Make sure to install dotenv: npm install dotenv

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // Use the environment variable
});

const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

// State dictionary
let state = {
  threadId: null,
  messages: [],
  assistant_id: 'asst_mKubPnoRJxz3sL90FRE9NEZH',  // Assistant ID
  assistantName: 'Bank Test',
};

// Route to get Assistant Info
app.get('/api/assistant-info', (req, res) => {
  res.json({ assistantId: state.assistant_id, assistantName: state.assistantName});
});

// Route to create a new Thread
app.post('/api/threads', async (req, res) => {
  try {
    const response = await openai.beta.threads.create();

    // Check if response is successful
    if (!response || response.object !== 'thread') {
      console.error('Error creating thread:', response);
      return res.status(500).json({ error: 'Failed to create thread' }); // Use 500 status code for internal server error
    }

    // If successful, proceed with storing threadId
    state.threadId = response.id; // This assumes response.id exists
    state.messages = []; // Reset messages
    res.json({ threadId: state.threadId }); // Send back the thread ID as JSON
    console.log('Thread created:', state.threadId);
  } catch (error) {
    console.error('Error creating thread:', error);
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

// Route to send a message and run the Assistant
app.post('/api/run', async (req, res) => {
  const { message } = req.body;

  // Log the incoming message
  console.log('Received message from client:', message);

  // Add the user message to state
  state.messages.push({ role: 'user', content: message });

  try {
    // First, create the user message in the thread
    console.log('Sending message to thread:', { role: "user", content: message });
    await openai.beta.threads.messages.create(state.threadId, {
      role: "user",
      content: message,  // Properly access content
    });

    // Log the thread state after sending the message
    console.log('Current thread state:', state);

    // Run the assistant on the thread
    const runRequest = {
      assistant_id: state.assistant_id, 
      instructions: 'Please respond to the user message',
    };

    console.log('Running assistant with runRequest:', runRequest);
    let run = await openai.beta.threads.runs.createAndPoll(state.threadId, runRequest);

    // If the run is successful
    if (run.status === 'completed') {
      let messagesResponse = await openai.beta.threads.messages.list(state.threadId);
      
      // Log the received messages
      console.log('Messages received from assistant:', messagesResponse.data);

      // Update state and handle the content array
      state.messages = messagesResponse.data.map(msg => {
        let contentText = '';
        if (msg.content && msg.content.length > 0 && msg.content[0].text) {
          contentText = msg.content[0].text.value;  // Extract the text value
        }
        return { 
          role: msg.role, 
          content: contentText, 
          createdAt: msg.created_at
        };
      });

      // Log the extracted text for debugging
      console.log('Processed messages with content:', state.messages);

      // Send the updated messages back to the client
      res.json({ messages: state.messages });
    } else {
      res.status(500).json({ error: 'Failed to run assistant' });
    }
  } catch (error) {
    console.error('Error running assistant:', error);
    res.status(500).json({ error: 'Failed to run assistant' });
  }
});

// Route to get current thread state
app.get('/api/state', (req, res) => {
  res.json({ threadId: state.threadId, messages: state.messages });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
