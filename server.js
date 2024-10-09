import express from 'express';
import { OpenAI } from 'openai';
import 'dotenv/config';  // Ensure dotenv is installed: npm install dotenv

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
};

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
      content: message,
    });

    // Ensure the assistant_id is set before running
    if (!state.assistant_id) {
      return res.status(400).json({ error: "Missing required parameter: 'assistant_id'" });
    }

    // Prepare the run request parameters
    const runRequest = {
      assistant_id: state.assistant_id,  // Ensure this is set correctly
    };

    // Run the assistant on the thread and poll for the result
    console.log('Running assistant with runRequest:', runRequest);
    let run = await openai.beta.threads.runs.createAndPoll(state.threadId, runRequest);

    // Check if the run was successful and get messages
    if (run && run.object === 'run') {
      // List the messages in the thread
      let messagesResponse = await openai.beta.threads.messages.list(state.threadId);

      // Update the state with all messages
      state.messages = messagesResponse.data;  // Update the state messages with the latest messages

      // Log the assistant's response messages
      console.log('Assistant run successful. Messages received:', state.messages);

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
