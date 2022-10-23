import express, {Request, Response} from 'express'
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import bodyParser from "body-parser";
import {blogs} from "./repositories/blogs-repository";
import {posts} from "./repositories/posts-repository";

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)

app.delete('/testing/all-data', (req: Request, res: Response) => {
    let resultBlogsDeleted = blogs.splice(0, blogs.length - 1)
    let resultPostsDeleted = posts.splice(0, posts.length - 1)
    if (resultBlogsDeleted && resultPostsDeleted) {
        res.sendStatus(204)
        return;
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

