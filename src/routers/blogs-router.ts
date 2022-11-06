import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authValidationMiddleware} from "../middlewares/auth-validation-middleware";
import {BlogsType, PostsType, BlogsQueryType, PostsQueryType} from "../repositories/db";
import {blogsGetRepository} from "../repositories/blogs-get-repository";

export const blogsRouter = Router({})

const nameValidation = body('name').isString().trim().isLength({
    min: 3,
    max: 15
}).withMessage('Title length should be from 3 to 15 symbols')

const urlValidation = body('youtubeUrl').isString().trim().isURL().isLength({
    min: 10,
    max: 100
}).withMessage('URL length should not exceed 100 symbols')

blogsRouter.get('/', async (req: Request<{}, {}, {}, BlogsQueryType, {}>, res: Response) => {
    let pageNumber = +req.query.pageNumber
    let pageSize = +req.query.pageSize
    let sortBy = req.query.sortBy
    let sortDirection = req.query.sortDirection

    let sortDirectionNumber = 0
    if (sortDirection === 'asc') {
        sortDirectionNumber = 1
    }

    let foundBlogs: BlogsType[] = await blogsGetRepository.findBlogs(pageNumber, pageSize, sortBy, sortDirectionNumber)
    let foundBlogsTotalCount = await blogsGetRepository.findBlogsTotalCount()
    let foundBlogsFull = {
        pagesCount: Math.ceil(foundBlogsTotalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: foundBlogsTotalCount,
        items: foundBlogs
    }

    res.status(200).send(foundBlogsFull)
})
blogsRouter.post('/',
    authValidationMiddleware,
    nameValidation,
    urlValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        let name = req.body.name
        let youtubeUrl = req.body.youtubeUrl

        const newBlog = await blogsService.createBlog(name, youtubeUrl)
        if (!newBlog) {
            res.sendStatus(400)
        } else {
            res.status(201).send(newBlog)
        }
    })
blogsRouter.get('/:id', async (req: Request, res: Response) => {
    let foundBlog = await blogsGetRepository.findBlogById(req.params.id)
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        res.status(200).send(foundBlog)
    }
})
blogsRouter.put('/:blogId',
    authValidationMiddleware,
    nameValidation,
    urlValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        let name = req.body.name
        let youtubeUrl = req.body.youtubeUrl

        const id = req.params.blogId

        const isUpdated = await blogsService.updateBlog(id, name, youtubeUrl)

        if (isUpdated) {
            const blog = await blogsGetRepository.findBlogById(id)
            res.status(204).send(blog)
        } else {
            res.sendStatus(404)
        }
    })
blogsRouter.delete('/:blogId',
    authValidationMiddleware,
    async (req: Request, res: Response) => {
        const id = req.params.blogId
        const isDeleted = await blogsService.deleteBlog(id)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
blogsRouter.post('/:blogId/posts',
    authValidationMiddleware,
    async (req: Request, res: Response) => {
        let foundBlog = await blogsGetRepository.findBlogById(req.params.id)
        if (!foundBlog) {
            res.sendStatus(404)
        } else {
            const title = req.body.title
            const shortDescription = req.body.shortDescription
            const content = req.body.content
            const blogId = req.params.blogId

            const newPost = await blogsService.createPostForSpecificBlog(title, shortDescription, content, blogId)
            if (!newPost) {
                res.sendStatus(400)
            } else {
                res.status(201).send(newPost)
            }
        }
    })
blogsRouter.get('/:blogId/posts', async (req: Request<{blogId: string}, {}, {}, PostsQueryType, {}>, res: Response) => {
    let pageNumber = +req.query.pageNumber
    let pageSize = +req.query.pageSize
    let sortBy = req.query.sortBy
    let sortDirection = req.query.sortDirection

    let sortDirectionNumber = 0
    if (sortDirection === 'asc') {
        sortDirectionNumber = 1
    }

    const foundPosts: PostsType[] = await blogsGetRepository.findPostsForSpecificBlog(req.params.blogId, pageNumber, pageSize, sortBy, sortDirectionNumber)
    if (!foundPosts) {
        res.sendStatus(404)
    } else {
        res.status(200).send(foundPosts)
    }
})