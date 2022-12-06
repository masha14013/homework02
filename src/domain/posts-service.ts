import {blogsCollection, BlogsType, PostsType} from "../repositories/db";
import {postsRepository} from "../repositories/posts-repository";
import {v4} from "uuid";
import {ObjectId} from "mongodb";

export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsType | undefined> {
        const blog: BlogsType | null = await blogsCollection.findOne({_id: new ObjectId(blogId)})
        if (blog) {
            const newPost: PostsType = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blog.id!.toString(),
                blogName: blog.name,
                createdAt: new Date().toISOString()
            }
            const createdPost = await postsRepository.createPost(newPost)
            return createdPost;
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await postsRepository.updatePost(id, title, shortDescription, content, blogId)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    }
}


