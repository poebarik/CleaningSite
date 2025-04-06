const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const basketRoutes = require('./routes/basketRoutes');
const requestRoutes = require('./routes/requestRoutes');

// const basketRoutes = require(path.join(__dirname, './routes/basketRoutes'));

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // URL вашего фронтенда
    credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/basket', basketRoutes);
app.use('/api/requests', requestRoutes);


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
