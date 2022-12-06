import {blogsRepository} from '../repositories/blogs-db-repository'
import {blogsCollection, BlogsType, PostsType} from "../repositories/db";
import {v1, v4} from "uuid";
import {ObjectId} from "mongodb";

export const blogsService = {
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogsType> {
        const newBlog: BlogsType =
            {
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: new Date().toISOString()
            }
        const createdBlog = await blogsRepository.createBlog(newBlog)
        return createdBlog
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return await blogsRepository.updateBlog(id, name, description, websiteUrl)
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    },
    async createPostForSpecificBlog(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsType | undefined> {
        const blog: BlogsType | null = await blogsCollection.findOne({_id: new ObjectId(blogId)})
        if (blog) {
        const newPost: PostsType =
            {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blog._id!.toString(),
                blogName: blog.name,
                createdAt: new Date().toISOString()
            }
            const createdPost = await blogsRepository.createPostForSpecificBlog(newPost)
            return createdPost
        }
    }
}