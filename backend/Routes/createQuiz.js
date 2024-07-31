const express = require('express');
const createRoutes = express.Router();
const CreateQuiz = require('../models/createQuizModel'); // Adjust the path to your model

// Create a new quiz
createRoutes.post('/quiz', async (req, res) => {
    try {
        const newQuiz = new CreateQuiz(req.body);
        const savedQuiz = await newQuiz.save();
        res.status(200).json(savedQuiz);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


createRoutes.get('/quizzes', async (req, res) => {
    try {
        const quizzes = await CreateQuiz.find();
        res.json(quizzes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = createRoutes;