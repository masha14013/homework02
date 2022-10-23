import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authValidationMiddleware} from "../middlewares/auth-validation-middleware";

export const blogsRouter = Router({})

const nameValidation = body('name').isString().trim().isLength({
    min: 3,
    max: 15
}).withMessage('Title length should be from 3 to 15 symbols')

const urlValidation = body('youtubeUrl').isString().trim().isURL().isLength({
    min: 10,
    max: 100
}).withMessage('URL length should not exceed 100 symbols')

blogsRouter.get('/', (req: Request, res: Response) => {
    const foundBlogs = blogsRepository.findBlogs()
    res.status(200).send(foundBlogs)
})
blogsRouter.post('/',
    authValidationMiddleware,
    nameValidation,
    urlValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {

        let name = req.body.name
        let youtubeUrl = req.body.youtubeUrl

        const newBlog = blogsRepository.createBlog(name, youtubeUrl)
        res.status(201).send(newBlog)

    })
blogsRouter.get('/:id', (req: Request, res: Response) => {
    let foundBlog = blogsRepository.findBlogById(req.params.id)
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).send(foundBlog)
    }
})
blogsRouter.put('/:id',
    authValidationMiddleware,
    nameValidation,
    urlValidation,
    inputValidationMiddleware,
    (req: Request, res: Response) => {
        let name = req.body.name
        let youtubeUrl = req.body.youtubeUrl

        const id = req.params.id

        const isUpdated = blogsRepository.updateBlog(id, name, youtubeUrl)

        if (isUpdated) {
            const blog = blogsRepository.findBlogById(id)
            res.status(204).send(blog)
        } else {
            res.sendStatus(404)
        }
    })
blogsRouter.delete('/:blogId',
    authValidationMiddleware,
    (req: Request, res: Response) => {
    const id = req.params.blogId
    const isDeleted = blogsRepository.deleteBlog(id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})