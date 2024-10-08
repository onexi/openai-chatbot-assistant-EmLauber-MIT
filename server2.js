import express from 'express';
import { OpenAI } from 'openai';

import 'dotenv/config';  // Make sure to install dotenv: npm install dotenv

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY  // Use the environment variable
});


const app = express();
const port = 3000;
const assistant_id = 'asst_mKubPnoRJxz3sL90FRE9NEZH';
const model_id = 'gpt-3.5-turbo';

const Assistants = await openai.beta.assistants.retrieve(assistant_id);
    console.log(Assistants);


app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

let state = {};

app.get('/', (req, res) => {
  res.render('index', { state });
});

app.post('/run-assistant', async (req, res) => {
  const { assistant_id, user_prompt } = req.body;

  try {
    // Step 1: Create a chat completion
    const completion = await openai.chat.completions.create({
      model: model_id, // Typically something like "gpt-4" or "gpt-3.5-turbo"
      messages: [
        { role: 'system', content: 'You are an AI assistant.' },
        { role: 'user', content: user_prompt }
      ]
    });

    const assistantResponse = completion.choices[0].message.content;

    // Step 2: Update the state dictionary
    state[assistant_id] = {
      user_prompt,
      assistant_response: assistantResponse
    };

    // Step 3: Send response back to client
    res.json({ success: true, messages: state[assistant_id] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
