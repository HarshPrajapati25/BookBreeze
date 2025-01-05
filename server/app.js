const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors')
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const app = express();
app.use(cors("*"))

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    })

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

const PORT = process.env.PORT || 5959;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
