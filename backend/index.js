const express = require('express');
const mongoose = require('mongoose');
const htmlRoutes = require('./Routes/htmlQuestion');
const jsRoutes = require('./Routes/jsQuestion');
const cssRoutes = require('./Routes/cssQuestion');
const cppRoutes = require('./Routes/cppQuestion');
require('dotenv').config();

const app = express();
const Port = process.env.PORT || 3000;
const DB = process.env.DB;

// Middleware to parse JSON bodies
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Routes
app.use(htmlRoutes);
app.use(jsRoutes);
app.use(cssRoutes);
app.use(cppRoutes);

// MongoDB connection
mongoose.connect(DB)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Start server
app.listen(Port, () => {
    console.log(`Server is running at http://localhost:${Port}`);
});
