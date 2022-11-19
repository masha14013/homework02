import dotenv from 'dotenv'
dotenv.config()
import express, {Request, Response} from 'express'
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import {authCollection, blogsCollection, postsCollection, usersCollection, runDb} from "./repositories/db";
import {authRouter} from "./routers/auth-router";
import {usersRouter} from "./routers/users-router";

export const app = express()
const port = process.env.PORT || 5000

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)
app.use('/auth', authRouter)
app.use('/users', usersRouter)

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    await authCollection.deleteMany({})
    await usersCollection.deleteMany({})
    res.sendStatus(204)
})

const startApp = async () => {
    await runDb()

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()