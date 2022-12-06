import {Request, Response, Router} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authValidationMiddleware} from "../middlewares/auth-validation-middleware";
import {PostsQueryType, PostsType} from "../repositories/db";
import {postsGetRepository} from "../repositories/posts-get-repository";
import {postsService} from "../domain/posts-service";
import {commentsGetRepository} from "../repositories/comments-get-repository";
import {commentsService} from "../domain/comments-service";
import {authMiddleware} from "../middlewares/auth-middleware";

export const postsQueryParamsParser = (query: { pageNumber: string, pageSize: string, sortBy: string, sortDirection: string }) => {
    let pageNumber = typeof query.pageNumber === 'string' ? +query.pageNumber : 1
    let pageSize = typeof query.pageSize === 'string' ? +query.pageSize : 10
    let sortBy = typeof query.sortBy === 'string' ? query.sortBy : 'createdAt'
    let sortDirection = query.sortDirection === 'asc' ? 1 : -1

    return {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
    }
}

export const postsRouter = Router({})

export const titleValidation = body('title').isString().trim().isLength({
    min: 3,
    max: 30
}).withMessage('Title length should be from 3 to 30 symbols')
export const descriptionValidation = body('shortDescription').isString().trim().isLength({
    min: 3,
    max: 100
}).withMessage('Description length should be from 3 to 100 symbols')
export const contentValidation = body('content').isString().trim().isLength({
    min: 3,
    max: 1000
}).withMessage('Content length should be from 3 to 1000 symbols')
const blogIdValidation = body('blogId').isString().trim().isLength({
    min: 1,
    max: 30
}).withMessage('Id length should be from 1 to 30 symbols')
export const commentContentValidation = body('content').isString().trim().isLength({
    min: 20,
    max: 300
}).withMessage('Content length should be from 20 to 300 symbols')

postsRouter.get('/', async (req: Request<{}, {}, {}, PostsQueryType, {}>, res: Response) => {
    const parsedQuery = postsQueryParamsParser(req.query)

    let foundPosts: { createdAt: string; blogName: string; shortDescription: string; title: string; blogId: string; content: string }[]
        = await postsGetRepository.findPosts(parsedQuery.pageNumber, parsedQuery.pageSize, parsedQuery.sortBy, parsedQuery.sortDirection)
    let foundPostsTotalCount = await postsGetRepository.findPostsTotalCount({})
    let foundPostsFull = {
        pagesCount: Math.ceil(foundPostsTotalCount / parsedQuery.pageSize),
        page: parsedQuery.pageNumber,
        pageSize: parsedQuery.pageSize,
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
postsRouter.get('/:postId/comments', async (req: Request<{ postId: string }, {}, {}, PostsQueryType, {}>, res: Response) => {
    const parsedQuery = postsQueryParamsParser(req.query)
    console.log('req.query', req.query)
    const postId = req.params.postId
    const post = await postsGetRepository.findPostById(postId)
    if(!post) return res.sendStatus(404)

    let foundComments = await commentsGetRepository.findCommentsForSpecificPost
    (postId, parsedQuery.pageNumber, parsedQuery.pageSize, parsedQuery.sortBy, parsedQuery.sortDirection)
    let foundCommentsTotalCount = await commentsGetRepository.findCommentsForSpecificPostTotalCount(postId)
    let foundCommentsFull = {
        pagesCount: Math.ceil(foundCommentsTotalCount / parsedQuery.pageSize),
        page: parsedQuery.pageNumber,
        pageSize: parsedQuery.pageSize,
        totalCount: foundCommentsTotalCount,
        items: foundComments
    }

    res.status(200).send(foundCommentsFull)
})
postsRouter.post('/:postId/comments',
    authMiddleware,
    commentContentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        const content = req.body.content
        const postId = req.params.postId

        const post = await postsGetRepository.findPostById(postId)
        console.log('post', post)
        if(!post) return res.sendStatus(404)
        const user = req.user
        console.log('user', user)
        if (!user) {
            res.status(500).send("no user in request")
            return
        }

        const newComment = await commentsService.createComment(content, postId, user)
        console.log('newComment, user', newComment, user)
        if (!newComment) {
            res.sendStatus(400)
        } else {
            res.status(201).send(newComment)
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