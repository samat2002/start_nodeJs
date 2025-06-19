// server.js
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 8080;

// Middleware to parse JSON
app.use(express.json());

// Route to receive logs
app.post('/log', (req, res) => {
    const data = req.body;
    console.log('📥 Received log:', data);

    // Optional: save to file
    fs.appendFileSync('log.txt', JSON.stringify(data, null, 2) + '\n');

    res.send('✅ Log received');
});

app.listen(PORT, () => {
    console.log(`🚀 Logging server listening on http://localhost:${PORT}`);
});
