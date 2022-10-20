import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";

export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    const foundPosts = postsRepository.findPosts()
    res.status(200).send(foundPosts)
})
postsRouter.post('/', (req: Request, res: Response) => {
    let title = req.body.title
    let shortDescription = req.body.shortDescription
    let content = req.body.content
    let blogId = req.body.blogId
    let blogName = req.body.blogName

    const errors = []

    if (!title || typeof title !== 'string' || !title.trim() || title.length > 30) {
        errors.push({
            message: "Incorrect title",
            field: "title"
        })
    }
    if (!shortDescription || typeof shortDescription !== 'string' || !shortDescription.trim() || shortDescription.length > 100) {
        errors.push({
            message: "Incorrect description",
            field: "shortDescription"
        })
    }
    if (!content || typeof content !== 'string' || !content.trim() || content.length > 1000) {
        errors.push({
            message: "Incorrect content",
            field: "content"
        })
    }
    if (!blogId || typeof blogId !== 'string' || !blogId.trim()) {
        errors.push({
            message: "Incorrect id",
            field: "blogId"
        })
    }

    if (errors.length) {
        res.status(400).send({errorsMessages: errors})
        return;
    }

    const newPost = postsRepository.createPost(title, shortDescription, content, blogId, blogName)
    res.status(201).send(newPost)
})
postsRouter.get('/:id', (req: Request, res: Response) => {
    let foundPost = postsRepository.findPostById(+req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
    } else {
        res.status(200).send(foundPost)
    }
})
postsRouter.put('/:id', (req: Request, res: Response) => {
    let title = req.body.title
    let shortDescription = req.body.shortDescription
    let content = req.body.content
    let blogId = req.body.blogId
    let blogName = req.body.blogName

    const errors = []

    if (!title || typeof title !== 'string' || !title.trim() || title.length > 30) {
        errors.push({
            message: "Incorrect title",
            field: "title"
        })
    }
    if (!shortDescription || typeof shortDescription !== 'string' || !shortDescription.trim() || shortDescription.length > 100) {
        errors.push({
            message: "Incorrect description",
            field: "shortDescription"
        })
    }
    if (!content || typeof content !== 'string' || !content.trim() || content.length > 1000) {
        errors.push({
            message: "Incorrect content",
            field: "content"
        })
    }
    if (!blogId || typeof blogId !== 'string' || !blogId.trim()) {
        errors.push({
            message: "Incorrect id",
            field: "blogId"
        })
    }
    if (!blogName || typeof blogName !== 'string' || !blogId.trim()) {
        errors.push({
            message: "Incorrect id",
            field: "blogId"
        })
    }

    if (errors.length) {
        res.status(400).send({errorsMessages: errors})
        return;
    }

    const isUpdated = postsRepository.updatePost(+req.params.id, title, shortDescription, content, blogId, blogName)

    if (isUpdated) {
        const post = postsRepository.findPostById(+req.params.id)
        res.status(204).send(post)
    } else {
        res.sendStatus(404)
    }
})
postsRouter.delete('/:postId', (req: Request, res: Response) => {
    const isDeleted = postsRepository.deletePost(+req.params.postId)
    if(isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})