import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import mongoose from 'mongoose'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'


const app = express()
app.use(json())

app.use(currentUserRouter)  //* Route to get current logged in user
app.use(signinRouter)       //* Route to sign in
app.use(signoutRouter)      //* Route to sign out
app.use(signupRouter)       //* Route to sign up for new users
app.use(errorHandler)       //* Errpr handling

//* Error handling for incorrect route
//* Throwing Error 404 Not Found
app.all('*', async ()=> {
    throw new NotFoundError
})

//* MongoDB connection function
const startDBConnection = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')  //* Path to mongodb services [kubernetes]
        console.log('Connected to Auth MongoDB')
    } catch (err) {
        console.log(err)
    }
}

app.listen(3000, () => {
    console.log('Auth service listening on port 3000!')
})

//* Connecting to mongoDB 
startDBConnection()