// Load environment variables
import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
// If using Node.js < 18, uncomment the next line
// const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// State dictionary
let state = {
  assistant_id: 'asst_mKubPnoRJxz3sL90FRE9NEZH',
  assistant_name: 'BankTest',
  threadId: null,
  messages: [],
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/*
// Route to get the list of Assistants
app.post('/api/assistants', async (req, res) => {
  let assistant_id = req.body.name;
  try {
    let myAssistant = await openai.assistants.retrieve(assistant_id);
    console.log(myAssistant);
    res.json(myAssistant);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving assistant');
  }
});
*/

// OpenAI V2 API calls
async function get_assistant(assistant_id) {
  try {
    let myAssistant = await openai.beta.assistants.retrieve(
      assistant_id
    );
    return myAssistant;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/*
// Route to generate a new thread
app.post('/api/threads', async (req, res) => {
  try {
    let thread = await openai.threads.create({
      assistant_id: state.assistant_id,
    });
    state.threadId = thread.id;
    res.json(thread);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating thread');
  }
});
*/

// OpenAI V2 API Create a Thread 
async function create_thread() {
  let response = await openai.beta.threads.create()
  state.thread_id = response.id;
  return response;
}

// OpenAI V2 API Create a Message
async function run_agent() { 
  try {
    let thread_id = state.thread_id
    let message = state.user_message;
    console.log('In run_agent state: ${JSON.stringify(state)}');
    await openai.beta.threads.messages.create(thread_id, 
      {
        role: 'user',
        content: message,
      });
      // run and poll thread V2 API feature
      let run = await openai.beta.threads.runs.createAndPoll(thread_id, {
        assistant_id: state.assistant_id
      });
      let run_id = run.id;
      state.run_id = run_id;

      // now retrieve the messages
      let messages = await openai.beta.threads.messages.list(thread_id);
      let all_messages = get_all_messages(messages);
      console.log('Run Finished: ${JSON.stringify(all_messages)}');
          return all_messages;
      } catch (error) {
    console.error('Error running assistant:', error);
    return error;
  }
  }
  

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
/*
// Route to add a message to the thread
app.post('/api/messages', async (req, res) => {
  const { role, content } = req.body;
  try {
    let message = await openai.messages.create({
      thread_id: state.threadId,
      role: role,
      content: content,
    });
    state.messages.push(message);
    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding message');
  }
});

// Route to run the assistant
app.post('/api/run', async (req, res) => {
  try {
    let run = await openai.runs.create({
      thread_id: state.threadId,
    });
    res.json(run);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error running assistant');
  }
});

// Route to get all messages in the thread
app.get('/api/messages', async (req, res) => {
  try {
    let messages = await openai.messages.list({
      thread_id: state.threadId,
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving messages');
  }
});
 */

