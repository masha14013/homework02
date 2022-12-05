import {blogsRepository} from '../repositories/blogs-db-repository'
import {BlogsType, PostsType} from "../repositories/db";
import {v4} from "uuid";

export const blogsService = {
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogsType> {
        const newBlog: BlogsType =
            {
                id: v4(),
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString()
            }
        const createdBlog = await blogsRepository.createBlog(newBlog)
        return createdBlog;
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await blogsRepository.updateBlog(id, name, description, websiteUrl)
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    },
    async createPostForSpecificBlog(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsType | undefined> {
        return await blogsRepository.createPostForSpecificBlog(title, shortDescription, content, blogId)
    }
}