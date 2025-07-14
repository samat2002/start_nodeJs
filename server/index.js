const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/images', require('./routes/images'));
app.use('/logs', require('./routes/logs'));     // ← optional
app.use('/users', require('./routes/users'));   // ← optional

app.listen(8080, () => {
    console.log(`✅ REST API ready at http://localhost:8080`);
});
