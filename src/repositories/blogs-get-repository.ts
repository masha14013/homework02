import {blogsCollection, BlogsType, postsCollection, PostsType} from "./db";
import {ObjectId} from "mongodb";

export const blogsGetRepository = {

    async findBlogs(searchNameTerm: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: any): Promise<BlogsType[]> {

        const findFilter = {name: {$regex: searchNameTerm ?? '', $options: "i"}}

        return await blogsCollection.find(findFilter, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort( {[sortBy]: sortDirection} )
            .toArray()
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
    async findPostsForSpecificBlog(id: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: any): Promise<PostsType[]> {
        return await postsCollection.find({blogId: id}, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray();
    }
}