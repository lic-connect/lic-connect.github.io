const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/plan', async (req, res) => {
  try {
    const { plan, sa, age, term, dab = "Y" } = req.body;

    if (!plan || !sa || !age || !term) {
      return res.status(400).send("Missing required fields.");
    }

    const params = new URLSearchParams({
      table: plan,
      sa,
      age,
      term,
      dab
    });

    const url = `https://www.licpremiumcalculator.in/calc/calc${plan}.php`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: params
    });

    const html = await response.text();
    res.send(html);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Server error');
  }
});

app.get('/', (req, res) => {
  res.send('LIC Premium Calculator API is running!');
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
