import express, {Request, Response} from 'express'
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import bodyParser from "body-parser";
import {blogsCollection, postsCollection, runDb} from "./repositories/db";

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await blogsCollection.deleteMany({})
    await postsCollection.deleteMany({})
    res.sendStatus(204)
})

const startApp = async () => {
    await runDb()

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()