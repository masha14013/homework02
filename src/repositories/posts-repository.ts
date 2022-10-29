import {blogsCollection, postsCollection} from "./db";
import {BlogsType} from "./blogs-db-repository";

export type PostsType = {
    id: string | null,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string | null
}

/*export let posts: PostsType[] = [
    {
        id: String(new Date().getTime()),
        title: "First Blog",
        shortDescription: "About content",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        blogId: "33",
        blogName: "Name of the blog"
    }
];*/

export const postsRepository = {
    async findPosts(): Promise<PostsType[]> {
        return await postsCollection.find({}).toArray();
    },
    async createPost (title: string, shortDescription: string, content: string, blogId: string): Promise<PostsType | undefined> {
        const blog: BlogsType | null = await blogsCollection.findOne({id: blogId})
        if (blog) {
            const newPost: PostsType = {
                id: (+(new Date())).toString(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blog.id,
                blogName: blog.name
            }
            await postsCollection.insertOne(newPost)
            return newPost;
        }
    },
    async findPostById (id: string): Promise<PostsType | null> {
        return await postsCollection.findOne({id: id})
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