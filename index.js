import express from 'express'
import dotenv from 'dotenv'
import connectDB  from './config/database.js'
import userRoutes from './routes/userRoutes.js'
import questionRoutes from './routes/questionRoutes.js'

dotenv.config()
connectDB()
const app = express()
app.use(express.json())

app.use('/api/user', userRoutes)
app.use('/api/question', questionRoutes)

app.get('/', (req, res) => {
    res.send('API is running...')
})

const PORT = process.env.PORT || 5000

app.listen(PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)
