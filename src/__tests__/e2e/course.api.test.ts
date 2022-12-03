import request from 'supertest'
import app from "../../app";

describe('Users e2e tests', () => {
    // const superUser = 'Basic YWRtaW46cXdlcnR5'
    const superUser = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2Mzg1ZmJmNTNhZjNlNDdkZTRhN2FmODEiLCJpYXQiOjE2Njk3MjUyMDQsImV4cCI6MTY3MDU4OTIwNH0.GWMnzn--rEXFxE45LwnmbLgw4QqJ3rVwwGnY76ls4Zo'
    const testSU = {
        login: 'admin',
        password: 'qwerty'
    }

    let blogId = ''
    let postId = ''
    let accessToken = ''

    beforeAll(async () => {
        const wipeAll = await request(app).delete('/testing/all-data')
        expect(wipeAll.statusCode).toBe(204)
    })
    it('should return 400 for not existing user', async () => {
        let result = await request(app)
            .post('/users')
            .auth(testSU.login, testSU.password, {type: "basic"})
            // .set('authorization', superUser)
            .send({login: '', password: '', email: ''})
            .expect(400)
        const createdUser = result.body;
        expect(createdUser).toStrictEqual({
            errorsMessages: [
                {
                    message: "Login length should be from 3 to 10 symbols",
                    field: "login"
                },
                {
                    message: "Password length should be from 6 to 20 symbols",
                    field: "password"
                },
                {
                    message: "Invalid value",
                    field: "email"
                }
            ]
        })
    })
    it('should return 201 and a newly created user', async () => {
         let result = await request(app)
             .post('/users')
             .set('authorization', 'Basic YWRtaW46cXdlcnR5')
             .send({login: 'admin', password: 'qwerty', email: 'https://qwerty.com'})
             .expect(201)
         const createdUser = result.body;
         expect(createdUser).toEqual({
             id: expect.any(String),
             login: 'admin',
             email: expect.any(String),
             createdAt: expect.any(String)
         })
    })

    it('should return 400 for incorrect auth', async () => {
        let result = await request(app)
            .post('/auth/login')
            .send({loginOrEmail: '', password: ''})
            .expect(400)
        const createdUser = result.body;
        expect(createdUser).toStrictEqual({
            errorsMessages: [
                {
                    message: "Login length should be from 3 to 30 symbols",
                    field: "loginOrEmail"
                },
                {
                    message: "Password length should be from 3 to 100 symbols",
                    field: "password"
                }
            ]
        })
    })
    it('should return 200 and JWT-token', async () => {
        let result = await request(app)
            .post('/auth/login')
            .send({loginOrEmail: 'admin', password: 'qwerty'})
            .expect(200)
        const createdAuth = result.body;
        accessToken = `Bearer ${result.body.accessToken}`
        expect(createdAuth).toEqual({
            accessToken: expect.any(String)
        })
    })

    it('should return 400 if data for creating a blog have incorrect values', async () => {
        let result = await request(app)
            .post('/blogs')
            .auth(testSU.login, testSU.password, {type: "basic"})
            .send({name: '', description: '', websiteUrl: ''})
            .expect(400)
        const createdUser = result.body;
        expect(createdUser).toStrictEqual({
            errorsMessages: [
                {
                    message: "Name length should be from 3 to 15 symbols",
                    field: "name"
                },
                {
                    message: "Description length should not exceed 500 symbols",
                    field: "description"
                },
                {
                    message: "Invalid value",
                    field: "websiteUrl"
                }
            ]
        })
    })
    it('should return 201 and a newly created blog', async () => {
        let result = await request(app)
            .post('/blogs')
            .auth(testSU.login, testSU.password, {type: "basic"})
            .send({name: 'hello', description: 'world', websiteUrl: 'https://hello.com'})
            .expect(201)

        blogId = result.body.id
        const createdUser = result.body;
        expect(createdUser).toEqual({
            id: expect.any(String),
            name: "hello",
            description: "world",
            websiteUrl: "https://hello.com",
            createdAt: expect.any(String)
        })
    })

    it('should return 400 if data for creating a post have incorrect values', async () => {
        let result = await request(app)
            .post(`/blogs/${blogId}/posts`)
            .auth(testSU.login, testSU.password, {type: "basic"})
            .send({title: '', shortDescription: '', content: ''})
            .expect(400)
        const createdPost = result.body;
        expect(createdPost).toStrictEqual({
            errorsMessages: [
                {
                    message: "Title length should be from 3 to 30 symbols",
                    field: "title"
                },
                {
                    message: "Description length should be from 3 to 100 symbols",
                    field: "shortDescription"
                },
                {
                    message: "Content length should be from 3 to 1000 symbols",
                    field: "content"
                }
            ]
        })
    })
    it('should return 201 and a newly created post', async () => {
        let result = await request(app)
            .post(`/blogs/${blogId}/posts`)
            .auth(testSU.login, testSU.password, {type: "basic"})
            .send({title: 'title', shortDescription: 'HELLO', content: 'world'})
            .expect(201)
        const createdPost = result.body;
        postId = result.body.id
        expect(createdPost).toEqual({
            id: expect.any(String),
            title: 'title',
            shortDescription: "HELLO",
            content: "world",
            blogId: expect.any(String),
            blogName: expect.any(String),
            createdAt: expect.any(String)
        })
    })

    it('should return 400 if data for creating a comment have incorrect values', async () => {
        let result = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('authorization', accessToken)
            .send({content: ''})
            .expect(400)
        const createdComment = result.body;
        expect(createdComment).toStrictEqual({
            errorsMessages: [
                {
                    message: "Content length should be from 20 to 300 symbols",
                    field: "content"
                }
            ]
        })
    })
    it('should return 201 and a newly created comment', async () => {
        let result = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('authorization', accessToken)
            .send({content: 'contentcontentcontentcontentcontent'})
            .expect(201)
        const createdComment = result.body;
        expect(createdComment).toEqual({
            id: expect.any(String),
            content: "contentcontentcontentcontentcontent",
            userId: expect.any(String),
            userLogin: expect.any(String),
            createdAt: expect.any(String)
        })
    })
})

/*
it('should return 400 for not existing comment', async () => {
    let result = await request(app)
        .get('/posts/:postId/comments')
        .send({login: '', password: '', email: ''})
        .expect(400)
    const createdUser = result.body;
    expect(createdUser).toStrictEqual({
        errorsMessages: [
            {
                message: "Login length should be from 3 to 10 symbols",
                field: "login"
            },
            {
                message: "Password length should be from 6 to 20 symbols",
                field: "password"
            },
            {
                message: "Invalid value",
                field: "email"
            }
        ]
    })
})
it('should return 201 and a newly created user', async () => {
    let result = await request(app)
        .post('/users')
        .set('authorization', 'Basic YWRtaW46cXdlcnR5')
        .send({login: 'admin', password: 'qwerty', email: 'https://qwerty.com'})
        .expect(201)
    const createdUser = result.body;
    expect(createdUser).toEqual({
        id: expect.any(String),
        login: 'admin',
        email: expect.any(String),
        createdAt: expect.any(String)
    })
})*/
