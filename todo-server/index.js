import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.APP_PORT;
const DB_NAME = 'todo_app';
const MONGO_URI = process.env.MONGO_URI + DB_NAME;

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
}));
app.use(express.json());

// connecting mongo DB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

import todoRoutes from './routes/todo.route.js';

app.use('/api/todos', todoRoutes);
