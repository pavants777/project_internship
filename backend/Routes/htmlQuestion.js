const express = require('express');
const router = express.Router();
const QuestionModel = require('../models/question.models');

// Route to add a new HTML quiz question
router.post('/Add/htmlQuestions', async (req, res) => {
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
router.get('/htmlQuestions', async (req, res) => {
    try {
        const questions = await QuestionModel.find({});
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).send('Error retrieving questions: ' + err.message);
    }
});

// Route to check the correct answer for a specific question
router.post('/checkAnswer', async (req, res) => {
    const { questionId, userAnswer } = req.body;

    if (!questionId || !userAnswer) {
        return res.status(400).send('Question ID and user answer are required');
    }

    try {
        const question = await QuestionModel.findById(questionId);

        if (!question) {
            return res.status(404).send('Question not found');
        }

        const correctAnswer = question.answer;
        const isCorrect = (userAnswer.toUpperCase() === correctAnswer);

        res.status(200).json({ isCorrect, correctAnswer });
    } catch (err) {
        res.status(500).send('Error checking answer: ' + err.message);
    }
});

module.exports = router;
