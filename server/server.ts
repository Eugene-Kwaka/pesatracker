import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query } from './db';
import transactionRoutes from './routes/transactions';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database Schema
const initDb = async () => {
    try {
        const schemaPath = path.join(process.cwd(), 'server', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await query(schemaSql);
        console.log('Database schema initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

app.use('/api/transactions', transactionRoutes);

app.listen(PORT, async () => {
    await initDb();
    console.log(`Server running on http://localhost:${PORT}`);
});
