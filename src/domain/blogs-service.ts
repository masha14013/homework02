import {blogsRepository} from '../repositories/blogs-db-repository'
import {BlogsType, PostsType} from "../repositories/db";

export const blogsService = {
    async createBlog(name: string, youtubeUrl: string): Promise<BlogsType> {
        const newBlog: BlogsType =
            {
                id: (+(new Date())).toString(),
                name: name,
                youtubeUrl: youtubeUrl,
                createdAt: new Date().toISOString()
            }
        const createdBlog = await blogsRepository.createBlog(newBlog)
        return createdBlog;
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {
        return await blogsRepository.updateBlog(id, name, youtubeUrl)
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    },
    async createPostForSpecificBlog(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsType | undefined> {
        return await blogsRepository.createPostForSpecificBlog(title, shortDescription, content, blogId)
    }
}