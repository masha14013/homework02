import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";

export const blogsRouter = Router({})

blogsRouter.get('/', (req: Request, res: Response) => {
    const foundBlogs = blogsRepository.findBlogs()
    res.status(200).send(foundBlogs)
})
blogsRouter.post('/', (req: Request, res: Response) => {
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl

    const errors = []
    const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/


    if (!name || typeof name !== 'string' || !name.trim() || name.length > 15) {
        errors.push({
            message: "Incorrect name",
            field: "name"
        })
    }

    if (!youtubeUrl || typeof youtubeUrl !== 'string' || !youtubeUrl.trim() || youtubeUrl.length > 100 || !pattern.test(youtubeUrl)) {
        errors.push({
            message: "Incorrect url",
            field: "youtubeUrl"
        })
    }

    if (errors.length) {
        res.status(400).send({errorsMessages: errors})
        return;
    }

    const newBlog = blogsRepository.createBlog(name, youtubeUrl)
    res.status(201).send(newBlog)

})
blogsRouter.get('/:id', (req: Request, res: Response) => {
    let foundBlog = blogsRepository.findBlogById(+req.params.id)
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).send(foundBlog)
    }
})
blogsRouter.put('/:id', (req: Request, res: Response) => {
    let name = req.body.name
    let youtubeUrl = req.body.youtubeUrl

    const errors = []
    const pattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+$/

    if (!name || typeof name !== 'string' || !name.trim()) {
        errors.push({
            message: "Incorrect name",
            field: "name"
        })
    }
    if (!youtubeUrl || typeof youtubeUrl !== 'string' || !youtubeUrl.trim() || youtubeUrl.length > 100 || !pattern[Symbol.match](youtubeUrl)) {
        errors.push({
            message: "Incorrect url",
            field: "youtubeUrl"
        })
    }

    if (errors.length) {
        res.status(400).send({errorsMessages: errors})
        return;
    }

    const id = +(req.params.id)

    const isUpdated = blogsRepository.updateBlog(id, name, youtubeUrl)

    if (isUpdated) {
        const blog = blogsRepository.findBlogById(id)
        res.status(204).send(blog)
    } else {
        res.sendStatus(404)
    }
})
blogsRouter.delete('/:blogId', (req: Request, res: Response) => {
    const id = +req.params.blogId
    const isDeleted = blogsRepository.deleteBlog(id)
    if(isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})