const express = require('express');
const fetch = require('node-fetch'); // npm install node-fetch
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/ask', async (req, res) => {
  try {
    const { message, user_id } = req.body;

    const response = await fetch('https://humbal-backend.hf.space/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, user_id }),
    });

    const data = await response.json();
    res.json({ response: data.answer || "I don't know." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ response: "Sorry, the backend might not be reachable." });
  }
});

app.listen(5000, () => console.log('Proxy server running on http://localhost:5000'));
