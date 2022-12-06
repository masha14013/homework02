import {blogsCollection, BlogsType, postsCollection, PostsType} from "./db";
import {ObjectId} from "mongodb";

export const blogsGetRepository = {

    async findBlogs(searchNameTerm: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: any): Promise<{ createdAt: string; websiteUrl: string; name: string; description: string; id: ObjectId }[]> {

        const findFilter = {name: {$regex: searchNameTerm ?? '', $options: "i"}}

        const blogs = await blogsCollection.find(findFilter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort( {[sortBy]: sortDirection} )
            .toArray()

        return blogs.map(blog => ({
            id: blog._id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt
        }))
    },
    async findBlogsTotalCount(searchNameTerm: string): Promise<number> {

        const findFilter = {name: {$regex: searchNameTerm ?? '', $options: "i"}}

        return blogsCollection.countDocuments(findFilter)
    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        const blog = await blogsCollection.findOne({_id: new ObjectId(id)})
        if(blog){
            // @ts-ignore
            delete Object.assign(blog, {["id"]: blog["_id"]})["_id"];
        }
        return blog

    },
    async findPostsForSpecificBlog(id: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: any): Promise<{ createdAt: string; blogName: string; id: ObjectId; shortDescription: string; title: string; blogId: string; content: string }[]> {
        const posts = await postsCollection.find({blogId: id})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray();

        return posts.map(post => ({
            id: post._id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }))
    }
}