import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authValidationMiddleware} from "../middlewares/auth-validation-middleware";
import {PostsQueryType, PostsType} from "../repositories/db";
import {postsGetRepository} from "../repositories/posts-get-repository";
import {postsService} from "../domain/posts-service";

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

postsRouter.get('/', async (req: Request<{}, {}, {}, PostsQueryType, {}>, res: Response) => {
    let pageNumber = +req.query.pageNumber
    let pageSize = +req.query.pageSize
    let sortBy = req.query.sortBy
    let sortDirection = req.query.sortDirection

    let sortDirectionNumber = 0
    if (sortDirection === 'asc') {
        sortDirectionNumber = 1
    }

    let foundPosts: PostsType[] = await postsGetRepository.findPosts(pageNumber, pageSize, sortBy, sortDirectionNumber)
    let foundPostsTotalCount = await postsGetRepository.findPostsTotalCount()
    let foundPostsFull = {
        pagesCount: Math.ceil(foundPostsTotalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: foundPostsTotalCount,
        items: foundPosts
    }

    res.status(200).send(foundPostsFull)
})
postsRouter.post('/',
    authValidationMiddleware,
    titleValidation,
    descriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        const title = req.body.title
        const shortDescription = req.body.shortDescription
        const content = req.body.content
        const blogId = req.body.blogId

        const newPost = await postsService.createPost(title, shortDescription, content, blogId)
        if (!newPost) {
            res.sendStatus(400)
        } else {
            res.status(201).send(newPost)
        }
    })
postsRouter.get('/:id', async (req: Request, res: Response) => {
    let foundPost = await postsGetRepository.findPostById(req.params.id)
    if (!foundPost) {
        res.sendStatus(404)
    } else {
        res.status(200).send(foundPost)
    }
})
postsRouter.put('/:postId',
    authValidationMiddleware,
    titleValidation,
    descriptionValidation,
    contentValidation,
    blogIdValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

        let title = req.body.title
        let shortDescription = req.body.shortDescription
        let content = req.body.content
        let blogId = req.body.blogId

        const id = req.params.postId

        const isUpdated = await postsService.updatePost(id, title, shortDescription, content, blogId)

        if (isUpdated) {
            const post = await postsRepository.findPostById(id)
            res.status(204).send(post)
        } else {
            res.sendStatus(404)
        }
    })
postsRouter.delete('/:postId',
    authValidationMiddleware,
    async (req: Request, res: Response) => {
        const isDeleted = await postsService.deletePost(req.params.postId)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })