import {blogsCollection, BlogsType, postsCollection, PostsType} from "./db";

export const blogsRepository = {
    async createBlog(newBlog: BlogsType): Promise<BlogsType> {
        await blogsCollection.insertOne(newBlog)
        return {
            id: newBlog._id?.toString(),
            name: newBlog.name,
            description: newBlog.description,
            createdAt: newBlog.createdAt,
            websiteUrl: newBlog.websiteUrl
        }
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        const result = await blogsCollection.updateOne({id: id}, {
            $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }
        })
        return result.matchedCount === 1
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async createPostForSpecificBlog(newPost: PostsType): Promise<PostsType | undefined> {
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
    }
}