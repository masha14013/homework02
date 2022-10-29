import {blogsCollection} from "./db";

export type BlogsType = {
    id: string,
    name: string,
    youtubeUrl: string,
    createdAt: string
}

/*export let blogs: BlogsType[] = [
    {
        id: String(new Date().getTime()),
        name: "Blogger A",
        youtubeUrl: "https://www.bloggerA.com"
    }
]*/

export const blogsRepository = {
    async findBlogs(): Promise<BlogsType[]> {
        return blogsCollection.find({} ).toArray();
    },
    async createBlog(name: string, youtubeUrl: string): Promise<BlogsType> {

        const newBlog: BlogsType = {
            id: (+(new Date())).toString(),
            name: name,
            youtubeUrl: youtubeUrl,
            createdAt: new Date().toISOString()
        }
        await blogsCollection.insertOne(newBlog)
        return newBlog;

    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        return await blogsCollection.findOne({id: id})
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
    }
}