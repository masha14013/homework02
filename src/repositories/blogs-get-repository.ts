import {blogsCollection, BlogsType, postsCollection, PostsType} from "./db";

export const blogsGetRepository = {
    async findBlogs(pageNumber: number, pageSize: number, sortBy: string, sortDirectionNumber: number): Promise<BlogsType[]> {
        return await blogsCollection.find({}, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort( {[sortBy]: sortDirectionNumber ? 1 : -1} )
            .toArray()
    },
    async findBlogsTotalCount(): Promise<number> {
        return blogsCollection.countDocuments({})
    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        return await blogsCollection.findOne({id: id}, {projection: {_id: 0}})
    },
    async findPostsForSpecificBlog(id: string, pageNumber: number, pageSize: number, sortBy: string, sortDirectionNumber: number): Promise<PostsType[]> {
        return await postsCollection.find({blogId: id}, {projection: {_id: 0}})

            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirectionNumber ? 1 : -1})
            .toArray();
    }
}