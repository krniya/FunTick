import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'


const app = express()
app.set('trust proxy', true)                         //* Express to trust proxied requests

app.use(json())
app.use(
    cookieSession({                                  //* Cookie seesion to get JWT from cookie
        signed: false,                               //* As we got JWT, don't required to encrypt cookie
        secure: process.env.NODE_ENV !== 'test'      //* Only accept request at HTTPS (Prod environment only)
    })
)

app.use(currentUserRouter)                          //* Route to get current logged in user
app.use(signinRouter)                               //* Route to sign in
app.use(signoutRouter)                              //* Route to sign out
app.use(signupRouter)                               //* Route to sign up for new users
app.use(errorHandler)                               //* Errpr handling

//* Error handling for incorrect route
//* Throwing Error 404 Not Found
app.all('*', async ()=> {
    throw new NotFoundError
})

export { app }