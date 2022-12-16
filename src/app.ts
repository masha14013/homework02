import dotenv from 'dotenv'
dotenv.config()

import express, {Request, Response} from 'express'
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import {
    authCollection,
    blogsCollection,
    postsCollection,
    usersCollection,
    commentsCollection
} from "./repositories/db";
import {authRouter} from "./routers/auth-router";
import {usersRouter} from "./routers/users-router";
import {commentsRouter} from "./routers/comments-router";
import {emailRouter} from "./routers/email-router";

const app = express()

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/email', emailRouter)

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await authCollection.deleteMany({})
    await usersCollection.deleteMany({})
    await commentsCollection.deleteMany({})

    res.sendStatus(204)
})

export default app