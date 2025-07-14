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