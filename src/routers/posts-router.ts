import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authValidationMiddleware} from "../middlewares/auth-validation-middleware";

export const postsRouter = Router({})

const titleValidation = body('title').isString().trim().isLength({
    min: 3,
    max: 30
}).withMessage('Title length should be from 3 to 30 symbols')
const descriptionValidation = body('shortDescription').isString().trim().isLength({
    min: 3,
    max: 100
}).withMessage('Description length should be from 3 to 100 symbols')
const contentValidation = body('content').isString().trim().isLength({
    min: 3,
    max: 1000
}).withMessage('Content length should be from 3 to 1000 symbols')
const blogIdValidation = body('blogId').isString().trim().isLength({
    min: 1,
    max: 30
}).withMessage('Id length should be from 1 to 30 symbols')
// const blogNameValidation = body('blogName').isString().trim().isLength({
//     min: 3,
//     max: 30
// }).withMessage('Blog name should be from 3 to 30 symbols')

postsRouter.get('/', (req: Request, res: Response) => {
    const foundPosts = postsRepository.findPosts()
    res.status(200).send(foundPosts)
})
postsRouter.post('/',
    authValidationMiddleware,
    titleValidation,
    descriptionValidation,
    contentValidation,
    blogIdValidation,
    /*blogNameValidation,*/
    inputValidationMiddleware,
    (req: Request, res: Response) => {

        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content
        const blogId = req.body.blogId

        const newPost = postsRepository.createPost(title, shortDescription, content, blogId)
        res.status(201).send(newPost)
    })
postsRouter.get('/:id', (req: Request, res: Response) => {
    let foundPost = postsRepository.findPostById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
    } else {
        res.status(200).send(foundPost)
    }
})
postsRouter.put('/:id',
    authValidationMiddleware,
    titleValidation,
    descriptionValidation,
    contentValidation,
    blogIdValidation,
    /*blogNameValidation,*/
    inputValidationMiddleware,
    (req: Request, res: Response) => {

        let title = req.body.title
        let shortDescription = req.body.shortDescription
        let content = req.body.content
        let blogId = req.body.blogId

        const isUpdated = postsRepository.updatePost(req.params.id, title, shortDescription, content, blogId)

        if (isUpdated) {
            const post = postsRepository.findPostById(req.params.id)
            res.status(204).send(post)
        } else {
            res.sendStatus(404)
        }
    })
postsRouter.delete('/:postId',
    authValidationMiddleware,
    (req: Request, res: Response) => {
        const isDeleted = postsRepository.deletePost(req.params.postId)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })