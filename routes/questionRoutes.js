import express from 'express'
const router = express.Router()
import { getQuestion, postQuestion } from '../controllers/questionController.js'
import { protect } from '../middleware/authMiddleware.js'

router.route('/:id').get(protect, getQuestion)
router.post('/', postQuestion)

export default router
