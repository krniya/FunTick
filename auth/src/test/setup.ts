import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../app'

//* Global signup function type declearation
declare global {
    function signup(): Promise<string[]>
}

//* Creating connection to MongoDB memory server
let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'key'

    mongo = await MongoMemoryServer.create()
    const mongoUri = mongo.getUri()
    await mongoose.connect(mongoUri)
})

//* Deleting all the data for all tables before performing tests
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()
    for(let collection of collections) {
        await collection.deleteMany({})
    }
})

//* Closing the MongoDB memory server
afterAll(async () => {
    await mongo.stop()
    await mongoose.connection.close()
})

//* Global sign up funtion
global.signup = async () => {
    //* Test Credentials
    const name = "Test Name"
    const email = "test@test.com"
    const password = "Password"
    const dob = "1997-04-22T00:00:00Z"
    const gender = "M"

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            name, email, password, dob, gender
        })
        .expect(201)
    
    const cookie = response.get("Set-Cookie")
    return cookie
}