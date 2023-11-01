import asyncHandler from 'express-async-handler'
import Question from '../models/questionModel.js';

const getQuestion = asyncHandler(async (req, res) => {
    
    const question = await Question.findOne({questionId: req.params.id})
    
    if (question) {
        res.status(200)
        res.json({
            question: question.question,
            options: question.options
        });
    } else {
        res.status(404)
        res.json({error: 'Question not found'})
    }
})

const postQuestion = asyncHandler(async (req, res) => {
    const { questionId, question , options } = req.body


    const questionExists = await Question.findOne({ questionId })

    if (questionExists) {
        res.status(400)
        throw new Error('QuestionId already exists')
    }

    const questionCreated = await Question.create({
        questionId,
        question,
        options
    })

    if (questionCreated) {
        res.status(201).json({
            _id: questionCreated._id
        })
    } else {
        res.status(400)
        throw new Error('Question could not be created')
    }
})

export {
    getQuestion,
    postQuestion
}
