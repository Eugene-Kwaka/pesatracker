import { Router } from 'express';
import { query } from '../db';

const router = Router();

// GET all transactions
router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM transactions ORDER BY date DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// POST new transaction
router.post('/', async (req, res) => {
    const { date, type, category, amount, paymentMethod, notes } = req.body;
    try {
        const result = await query(
            `INSERT INTO transactions (date, type, category, amount, payment_method, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
            [date, type, category, amount, paymentMethod, notes]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// PUT update transaction
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { date, type, category, amount, paymentMethod, notes } = req.body;
    try {
        const result = await query(
            `UPDATE transactions 
       SET date = $1, type = $2, category = $3, amount = $4, payment_method = $5, notes = $6
       WHERE id = $7
       RETURNING *`,
            [date, type, category, amount, paymentMethod, notes, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;
