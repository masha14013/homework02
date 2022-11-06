import {blogsCollection, BlogsType, postsCollection, PostsType} from "./db";

export const postsRepository = {
    async createPost (newPost: PostsType): Promise<PostsType | undefined> {
        const newPostWithoutId: PostsType = Object.assign({}, newPost)
        await postsCollection.insertOne(newPost)
        return newPostWithoutId;
    },
    async findPostById (id: string): Promise<PostsType | null> {
        return await postsCollection.findOne({id: id}, {projection: {_id: 0}})
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        const blog = await blogsCollection.findOne({id: blogId})
        if (!blog) return false

        let post = await postsCollection.findOne({id: id})
        if (!post) {
            return false;
        } else {
            const result = await postsCollection.updateOne({id: id}, {
                $set: {
                    title: title,
                    shortDescription: shortDescription,
                    content: content,
                    blogId: blog.id,
                    blogName: blog.name
                }
            })
            return result.matchedCount === 1
        }
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
}