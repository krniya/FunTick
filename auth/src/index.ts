import mongoose from 'mongoose'
import { app } from './app'

//* MongoDB connection function
const startDBConnection = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')  //* Path to mongodb services [kubernetes]
        console.log('Connected to Auth MongoDB')
    } catch (err) {
        console.log(err)
    }
}

//* Environmnet variable defination check function
const envVariableCheck = () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined')
    }
}

app.listen(3000, () => {
    console.log('Auth service listening on port 3000!')
})

//* Connecting to mongoDB 
startDBConnection()

//* Checking environment variable declearation
envVariableCheck()