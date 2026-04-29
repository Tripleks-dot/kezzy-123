const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// GET all occupants
app.get('/api/occupants', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Occupants');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single occupant by ID
app.get('/api/occupants/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Occupants WHERE ID = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Occupant not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD new occupant
app.post('/api/occupants', async (req, res) => {
    const { Name, Rent, Paid } = req.body;

    if (!Name || Rent === undefined) {
        return res.status(400).json({ error: 'Name and Rent are required' });
    }

    try {
        const [result] = await db.query(
            'INSERT INTO Occupants (Name, Rent, Paid) VALUES (?, ?, ?)',
            [Name, Rent, Paid || 0]
        );
        res.status(201).json({
            id: result.insertId,
            message: 'Occupant added successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE payment
app.put('/api/occupants/:id', async (req, res) => {
    const { Paid } = req.body;

    if (Paid === undefined) {
        return res.status(400).json({ error: 'Paid amount is required' });
    }

    try {
        const [result] = await db.query(
            'UPDATE Occupants SET Paid = ? WHERE ID = ?',
            [Paid, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Occupant not found' });
        }

        res.json({ message: 'Payment updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE occupant
app.delete('/api/occupants/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM Occupants WHERE ID = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Occupant not found' });
        }

        res.json({ message: 'Occupant deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Kodi System backend running on http://localhost:${PORT}`);
});