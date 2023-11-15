import express, {Request, Response} from 'express'
import { body, validationResult } from 'express-validator'

const router = express.Router()

router.post('/api/users/signup', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min:8, max: 20}).withMessage('Password must be between 8 and 20 characters')
], (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new Error('Invalid email or password')
    }

    const {email, password} = req.body

    console.log('creating a user...')
    throw new Error('Error connecting to Database')

    res.send({})
})

export {router as signupRouter}