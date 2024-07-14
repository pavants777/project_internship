const express = require('express');
const router = express.Router();
const QuestionModel = require('../models/jsquestion.model');

// Route to add a new HTML quiz question
router.post('/Add/jsQuestions', async (req, res) => {
    const { question, options, answer } = req.body;

    if (!question || !options || !answer) {
        return res.status(400).send('All fields are required');
    }

    if (options.length !== 4) {
        return res.status(400).send('There must be exactly 4 options');
    }

    if (!['A', 'B', 'C', 'D'].includes(answer)) {
        return res.status(400).send('Answer must be one of A, B, C, or D');
    }

    try {
        const newQuestion = new QuestionModel({
            question,
            options,
            answer
        });
        
        await newQuestion.save();
        res.status(201).send('Question added successfully');
    } catch (err) {
        res.status(500).send('Error saving question: ' + err.message);
    }
});

// Route to retrieve all HTML quiz questions
router.get('/jsQuestions', async (req, res) => {
    try {
        const questions = await QuestionModel.find({});
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).send('Error retrieving questions: ' + err.message);
    }
});

module.exports = router;
