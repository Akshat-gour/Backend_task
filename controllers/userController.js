import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

const authUser = asyncHandler(async (req, res) => {
    const { nickName, password } = req.body

    const user = await User.findOne({ nickName })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            nickName: user.nickName,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid nick name or password')
    }
})

const registerUser = asyncHandler(async (req, res) => {
    const { nickName, password } = req.body

    const userExists = await User.findOne({ nickName })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        nickName,
        password,
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            nickName: user.nickName,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

const getScore = asyncHandler(async (req, res) => {

    const user = await User.findById( req.user.id )

    if (user.answers.length===1) {
        res.status(200)
        res.json({ message: "You seem to have a sleep effciency of 80% That's good"})
    } else {
        res.status(401)
        throw new Error('Score cannot be generated')
    }
})

const answerQuestion = asyncHandler(async(req, res) => {
    const { questionId, answer } = req.body

    try {
        const filter = {
          nickName: req.user.nickName,
          'answers.questionId': questionId,
        };
      
        const update = {
          $set: { 'answers.$.answer': answer },
        };
      
        const options = { new: true };
      
        let updatedUser = await User.findOneAndUpdate(filter, update, options);
      
        if (!updatedUser) {
          // If the questionId doesn't exist in the answers array, push the new answer
          const pushUpdate = {
            $push: {
              answers: {
                questionId,
                answer,
              },
            },
          };
      
          updatedUser = await User.findOneAndUpdate({ nickName: req.user.nickName }, pushUpdate, options);
        }
      
        if (!updatedUser) {
          res.status(400).json({ message: 'Invalid user data' });
        } else {
          res.status(201).json({
            _id: updatedUser._id,
            nickName: updatedUser.nickName,
          });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
})

export {
    authUser,
    registerUser, 
    getScore,
    answerQuestion
}
