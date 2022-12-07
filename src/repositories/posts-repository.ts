import {blogsCollection, postsCollection, PostsType} from "./db";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async createPost (newPost: PostsType): Promise<PostsType | undefined> {
        await postsCollection.insertOne(newPost)
        return {
            id: newPost._id?.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId!,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt
        }
    },
    async findPostById (id: string): Promise<PostsType | null> {
        return await postsCollection.findOne({_id: new ObjectId(id)})
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(blogId)})
        if (!blog) return false

        let post = await postsCollection.findOne({_id: new ObjectId(id)})
        if (!post) {
            return false;
        } else {
            const result = await postsCollection.updateOne({_id: new ObjectId(id)}, {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blog._id.toString(),
                    blogName: blog.name
                }
            })
            return result.matchedCount === 1
        }
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}