const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json());
app.use(cors());

const port = 8000
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

// let { name, age } = req.body;
// const result = await connection.query('INSERT INTO users (name, age) VALUES (?, ?)', [name, age]);
app.post('/users', async (req, res) => {
    try {
        let user = req.body;
        const [result] = await connection.query('INSERT INTO users SET ?', user);
        res.json({
            massage: 'User created successfully',
            user: result
        });
    }
    catch (error) {
        console.log("error massage: ", error.message);
        res.status(500).json({
            message: 'Error creating user',
            // error: error.message
        });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [result] = await connection.query('SELECT * FROM users where id = ?', id);//[id]
        if (result.length === 0) {
            // throw new Error("User not found");
            return res.status(404).json({
                message: 'User not found'
            });
        }

        res.json(result[0]);
    }
    catch (error) {
        res.status(500).json({
            message: 'Error fetching users',
            error: error.message
        });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let user = req.body;
        const [result] = await connection.query('UPDATE users SET ? WHERE id = ?', [user, id]);
        res.json({
            massage: 'User Updated successfully',
            user: result
        });
    }
    catch (error) {
        console.log("error massage: ", error.message);
        res.status(500).json({
            message: 'Error creating user',
            // error: error.message
        });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [result] = await connection.query('DELETE FROM users  WHERE id = ?', [id]);
        res.json({
            massage: 'User deleted successfully',
            user: result
        });
    }
    catch (error) {
        console.log("error massage: ", error.message);
        res.status(500).json({
            message: 'Error creating user',
            // error: error.message
        });
    }
});

app.listen(port, async () => {
    await initMySQL()
    console.log(`Server is running on http://localhost:${port}`);
});