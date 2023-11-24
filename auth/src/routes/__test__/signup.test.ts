import request from 'supertest'
import { app } from '../../app'

it('should return 201 status when sucessfully signed up', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            name: "Test User",
            email: "test@test.com",
            password: "Password",
            dob: "1997-04-22T00:00:00Z",
            gender: "M"
        })
        .expect(201)
})

it('should returns 400 status when no name provided', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "Password",
            dob: "2000-01-01T00:00:00Z",
            gender: "M"
        })
        .expect(400)
})

it('should returns 400 status when invalid or no email provided', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            name: "Test User",
            email: "test@test",
            password: "Password",
            dob: "2000-01-01T00:00:00Z",
            gender: "M"
        })
        .expect(400)
})

it('should returns 400 status when invalid or no password is provided', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            name: "Test User",
            email: "test@test.com",
            password: "Pass",
            dob: "2000-01-01T00:00:00Z",
            gender: "M"
        })
        .expect(400)
})

it('should returns 400 status when invalid or no dob provided', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            name: "Test User",
            email: "test@test.com",
            password: "Password",
            gender: "M"
        })
        .expect(400)
})

it('should returns 400 status when no gender is provided', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            name: "Test User",
            email: "test@test.com",
            password: "Password",
            dob: "2000-01-01T00:00:00Z",
        })
        .expect(400)
})

it('should disallows duplicate email',async () => {
    await global.signup()
    await request(app)
        .post('/api/users/signup')
        .send({
            name: "Test User",
            email: "test@test.com",
            password: "Password",
            dob: "1997-04-22T00:00:00Z",
            gender: "M"
        })
        .expect(400) 
})

it('should sets cookies after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            name: "Test User",
            email: "test@test.com",
            password: "Password",
            dob: "2000-01-01T00:00:00Z",
            gender: "M"
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
})