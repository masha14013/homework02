import {Request, Response, Router} from "express";
import {blogsService} from "../domain/blogs-service";
import {body} from "express-validator";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {authValidationMiddleware} from "../middlewares/auth-validation-middleware";
import {BlogsType, PostsType, BlogsQueryType, PostsQueryType} from "../repositories/db";
import {blogsGetRepository} from "../repositories/blogs-get-repository";
import {postsGetRepository} from "../repositories/posts-get-repository";

const queryParamsParser = (query: {pageNumber: string, pageSize: string, sortBy: string, sortDirection: string}) => {
    let pageNumber = query.pageNumber && typeof query.pageNumber === 'string' ? +query.pageNumber : 1 //undefined  = NuN
    let pageSize = query.pageSize && typeof query.pageSize === 'string' ? +query.pageSize : 10
    let sortBy = query.sortBy && typeof query.sortBy === 'string' ? query.pageSize : 'createdAt'
    /*let sortDirection = query.sortDirection && typeof query.sortDirection === 'string' ? query.sortDirection : 'desc'*/
    let sortDirectionNumber = 0

    if (query.sortDirection && typeof query.sortDirection === 'string') {

        if (query.sortDirection === 'asc') {
            sortDirectionNumber = 1
        } else if (query.sortDirection === 'desc') {
            sortDirectionNumber = -1
        }
    } else {
        sortDirectionNumber = -1
    }

    return {
        pageNumber,
        pageSize,
        sortBy,
        sortDirectionNumber // -1 | 1
    }
}

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
    const parsedQuery = queryParamsParser(req.query)

    let foundBlogs: BlogsType[] = await blogsGetRepository.findBlogs(parsedQuery.pageNumber, parsedQuery.pageSize, parsedQuery.sortBy, parsedQuery.sortDirectionNumber)
    let foundBlogsTotalCount = await blogsGetRepository.findBlogsTotalCount()
    let foundBlogsFull = {
        pagesCount: Math.ceil(foundBlogsTotalCount / parsedQuery.pageSize),
        page: parsedQuery.pageNumber,
        pageSize: parsedQuery.pageSize,
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
        let foundBlog = await blogsGetRepository.findBlogById(req.params.blogId)
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
blogsRouter.get('/:blogId/posts', async (req: Request<{ blogId: string }, {}, {}, PostsQueryType, {}>, res: Response) => {
    const parsedQuery = queryParamsParser(req.query)

    let id = req.params.blogId

    let foundBlog = await blogsGetRepository.findBlogById(id)
    if (!foundBlog) {
        res.sendStatus(404)
    } else {
        const foundPosts: PostsType[] = await blogsGetRepository.findPostsForSpecificBlog(id, parsedQuery.pageNumber, parsedQuery.pageSize, parsedQuery.sortBy, parsedQuery.sortDirectionNumber)
        if (!foundPosts) {
            res.sendStatus(404)
        } else {
            let foundPostsTotalCount = await postsGetRepository.findPostsTotalCount()
            let foundPostsFull = {
                pagesCount: Math.ceil(foundPostsTotalCount / parsedQuery.pageSize),
                page: parsedQuery.pageNumber,
                pageSize: parsedQuery.pageSize,
                totalCount: foundPostsTotalCount,
                items: foundPosts
            }
            res.status(200).send(foundPostsFull)
        }
    }

})
