const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser')

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

const userRoutes = require('./routes/userRoutes');
const lobbyRouter = require('./routes/lobbyRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

app.use('/api/user', userRoutes);
app.use('/api/lobby', lobbyRouter);
app.use('/api/session', sessionRoutes);


app.use((err, req, res, next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({ error: 'Internal server error from app' });
});

module.exports = app;
