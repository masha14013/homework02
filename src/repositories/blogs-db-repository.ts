import {blogsCollection} from "./db";

type BlogsType = {
    id: string,
    name: string,
    youtubeUrl: string
}

export let blogs: BlogsType[] = [
    {
        id: String(new Date().getTime()),
        name: "Blogger A",
        youtubeUrl: "https://www.bloggerA.com"
    }
]

export const blogsRepository = {
    async findBlogs() {
        return await blogsCollection.find({}).toArray();
    },
    async createBlog(name: string, youtubeUrl: string) {

        const newBlog = {
            id: (+(new Date())).toString(),
            name: name,
            youtubeUrl: youtubeUrl
        }
        const result = await blogsCollection.insertOne(newBlog)
        return newBlog;

    },
    async findBlogById(id: string) {
        return await blogsCollection.findOne({id: id})
    },
    async updateBlog(id: string, name: string, youtubeUrl: string) {

        let result = await blogsCollection.updateOne({id: id}, {
            $set: {
                name: name,
                youtubeUrl: youtubeUrl
            }
        })

        return result.matchedCount !== 0
    },
    async deleteBlog(id: string) {
        const result = await blogsCollection.deleteOne({id: id})
        return result.deletedCount !== 0
    }
}