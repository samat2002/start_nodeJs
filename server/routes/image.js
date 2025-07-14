const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE new image log
router.post('/', async (req, res) => {
    const { user, image, filename, time } = req.body;
    const formattedTime = time.replace('T', ' ').replace('Z', '').slice(0, 19);

    try {
        await db.execute(
            'INSERT INTO images (user, image, filename, time) VALUES (?, ?, ?, ?)',
            [user, image, filename, formattedTime]
        );
        res.json({ message: '✅ Image saved' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ all images
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM images ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE an image log
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await db.execute('DELETE FROM images WHERE id = ?', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;