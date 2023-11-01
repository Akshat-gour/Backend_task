import express from 'express'
const router = express.Router()
import { answerQuestion, authUser, getScore, registerUser } from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/register').post(registerUser)
router.get('/login', authUser)
router.post('/answer', protect, answerQuestion)
router.get('/score', protect, getScore)

export default router
