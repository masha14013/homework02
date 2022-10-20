import express, { Request, Response } from 'express'
import {postsRouter} from "./routers/posts-router";
import {blogsRouter} from "./routers/blogs-router";
import bodyParser from "body-parser";

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/posts', postsRouter)
app.use('/blogs', blogsRouter)

/*app.delete('/testing/all-data', (req: Request, res: Response) => {
    let result1 = blogs.splice(0, blogs.length - 1)
    if (result) {
        res.status(204).send(result)
    } else {
        res.sendStatus(404)
    }
})*/

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

