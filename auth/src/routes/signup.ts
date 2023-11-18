import express, {Request, Response} from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error'
import { User } from '../models/users'
import { BadRequestError } from '../errors/bad-request-error'

const router = express.Router()


// * @desc        User Sign up
// * @route       POST /api/users/signup
// * @access      Public
router.post('/api/users/signup', [
    body('name').notEmpty().withMessage('Please provide your name'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().isLength({min:8, max: 20}).withMessage('Password must be between 8 and 20 characters'),
    body('dob').notEmpty().withMessage('Please provide date in proper format'),
    body('gender').notEmpty().withMessage('Please provide proper gender (M/F/O)')
], async (req: Request, res: Response) => {
    //* validating sent paramerter for sign up
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        throw new RequestValidationError(errors.array())
    }

    const {name, email, password, dob, gender} = req.body
    //* Checking if email is already been used
    const existingUser = await User.findOne({ email })
    if(existingUser) {
        console.log('Email in user')
        throw new BadRequestError('Email already in use')
    }
    //* User Sign Up
    const user = User.build({name, email, password, dob, gender})
    await user.save();

    res.status(201).send(user);

})

export {router as signupRouter}