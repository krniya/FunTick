import express from 'express'

const router = express.Router()

// * @desc        Sign out user
// * @route       POST /api/users/signout
// * @access      Private
router.post('/api/users/signout', (req, res) => {
    //* Removing JWT from session to sign out
    req.session = null
    res.send({})
})

export {router as signoutRouter}