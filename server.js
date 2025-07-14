// server.js
const express = require('express');
const app = express();
const port = 8080

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

// Middleware to parse JSON
const mysql = require('mysql2/promise')

let connection;
const initMySQL = async () => {
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'test',
    });
}


// Route to receive logs
app.post('/log', async (req, res) => {
    console.log("Received log:", req.body);
    try {
        const data = req.body;

        // Convert ISO to SQL DATETIME format
        data.time = data.time.replace('T', ' ').replace('Z', '').slice(0, 19);

        const [result] = await connection.query('INSERT INTO log SET ?', data);
        res.json({
            message: 'User created successfully',
            user: result
        });
    } catch (error) {
        console.log("error message: ", error.message);
        res.status(500).json({
            message: 'Error creating user',
        });
    }
});

// app.post('/images', async (req, res) => {
//     console.log("Received log:", req.body);
//     try {
//         const data = req.body;

//         // Convert ISO to SQL DATETIME format
//         data.time = data.time.replace('T', ' ').replace('Z', '').slice(0, 19);

//         const [result] = await connection.query('INSERT INTO images SET ?', data);
//         res.json({
//             message: 'image created successfully',
//             image: result
//         });
//     } catch (error) {
//         console.log("error message: ", error.message);
//         res.status(500).json({
//             message: 'Error creating image',
//         });
//     }
// });

app.post('/images', async (req, res) => {
    const data = req.body;
    data.time = data.time.replace('T', ' ').replace('Z', '').slice(0, 19);

    try {
        // Check if already exists
        const [existing] = await connection.query('SELECT id FROM images WHERE image = ?', [data.image]);

        if (existing.length > 0) {
            return res.status(200).json({ message: '⚠️ Image already exists, skipped.' });
        }

        const [result] = await connection.query('INSERT INTO images SET ?', data);

        res.json({ message: '✅ Image saved!', result });
    } catch (error) {
        console.error('❌ Real DB error:', error.message); // 👈 Show real error
        res.status(500).json({ message: '❌ Server error', error: error.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const [result] = await connection.query('SELECT * FROM users');
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
});

app.get('/images', async (req, res) => {
    try {
        const [result] = await connection.query('SELECT * FROM images');
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
});


app.listen(port, async () => {
    await initMySQL()
    console.log(`Server is running on http://localhost:${port}`);
});