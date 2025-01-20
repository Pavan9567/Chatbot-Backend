const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send("backend is running!");
});

db.connect((err) => {
    console.log('Connected to database');
});

// Endpoint to send and save messages
app.post('/api/messages', (req, res) => {
    const { user_message } = req.body;
    let bot_reply;

    if (user_message.toLowerCase().includes('Hello')) {
        bot_reply = 'Hi there! How can I help you today?';
    } else if (user_message.toLowerCase().includes('How are you')) {
        bot_reply = 'I am just a bot, but I am functioning perfectly!';
    } else if (user_message.toLowerCase().includes('What is your name')) {
        bot_reply = 'I am your friendly chatbot!';
    } else {
        bot_reply = 'Sorry, I didn’t understand that. Can you please rephrase?';
    }

    const query = 'INSERT INTO messages (user_message, bot_reply) VALUES (?, ?)';
    db.query(query, [user_message, bot_reply], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ id: result.insertId, user_message, bot_reply });
    });
});

// Endpoint to retrieve all messages
app.get('/api/messages', (req, res) => {
    const query = 'SELECT * FROM messages';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
