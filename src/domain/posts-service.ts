import {blogsCollection, BlogsType, PostsType} from "../repositories/db";
import {postsRepository} from "../repositories/posts-repository";
import {v4} from "uuid";

export const postsService = {
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsType | undefined> {
        const blog: BlogsType | null = await blogsCollection.findOne({id: blogId})
        if (blog) {
            const newPost: PostsType = {
                id: v4(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            }
            const createdPost = await postsRepository.createPost(newPost)
            return createdPost;
            /*const newPostWithoutId: PostsType = Object.assign({}, newPost)
            await postsCollection.insertOne(newPost)
            return newPostWithoutId;*/
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        return await postsRepository.updatePost(id, title, shortDescription, content, blogId)
    },
    async deletePost(id: string): Promise<boolean> {
        return await postsRepository.deletePost(id)
    }
}


