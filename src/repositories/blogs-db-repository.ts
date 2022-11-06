import {blogsCollection, BlogsType, postsCollection, PostsType} from "./db";

export const blogsRepository = {
    async createBlog(newBlog: BlogsType): Promise<BlogsType> {
        const newBlogWithoutId: BlogsType = Object.assign({}, newBlog)
        await blogsCollection.insertOne(newBlog)
        return newBlogWithoutId;
    },
    async updateBlog(id: string, name: string, youtubeUrl: string): Promise<boolean> {

        const result = await blogsCollection.updateOne({id: id}, {
            $set: {
                name: name,
                youtubeUrl: youtubeUrl
            }
        })

        return result.matchedCount === 1
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async createPostForSpecificBlog(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsType | undefined> {
        const blog: BlogsType | null = await blogsCollection.findOne({id: blogId})
        if (blog) {
            const newPost: PostsType = {
                id: (+(new Date())).toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blog.id,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            }
            const newPostWithoutId: PostsType = Object.assign({}, newPost)
            await postsCollection.insertOne(newPost)
            return newPostWithoutId;
        }
    }
}