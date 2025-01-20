const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// Database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

pool.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to database');
    }
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

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = pool.promise();