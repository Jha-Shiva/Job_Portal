//package imports
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import morgan from 'morgan'

//security packages
import helmet from 'helmet'
import sanitizeBody from './middlewares/sanitizationMiddleware.js'


//files imports
import connectDB from './config/db.js'
//routes imports
import testRoutes from './routes/testRoutes.js'
import authRoutes from './routes/authRoutes.js'
import errorMiddleware from './middlewares/errorMiddleware.js'
import userRoutes from './routes/userRoutes.js'
import jobsRoutes from './routes/jobsRoutes.js'


//config dot env
dotenv.config()

//database connection
connectDB()

//rest object
const app = express();

//middleware
app.use(helmet())
app.use(sanitizeBody);
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))

//routes
app.use('/api/v1/test', testRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/job', jobsRoutes)

//validation middleware
app.use(errorMiddleware)

//port
const PORT = process.env.PORT || 8000
const MODE = process.env.DEV_MODE

//listen
app.listen(PORT, ()=>{
    console.log(`Node Server is Running in ${MODE} MODE on Port no ${PORT}`.bgCyan);
})

