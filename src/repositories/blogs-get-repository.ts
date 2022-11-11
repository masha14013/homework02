import {blogsCollection, BlogsType, postsCollection, PostsType} from "./db";

export const blogsGetRepository = {

    async findBlogs(searchNameTerm: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: any): Promise<BlogsType[]> {
        let findFilter = {}
        const pattern = `${searchNameTerm}`
        if (searchNameTerm) {
            findFilter = {name: {$regex: pattern}, $options: 'i'}
        }

        return await blogsCollection.find(findFilter, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort( {[sortBy]: sortDirection} )
            .toArray()
    },
    async findBlogsTotalCount(searchNameTerm: string): Promise<number> {
        let findFilter = {}
        const pattern = `${searchNameTerm}`
        if (searchNameTerm) {
            findFilter = {name: {$regex: pattern}, $options: 'i'}
        }
        return blogsCollection.countDocuments({findFilter})
    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        return await blogsCollection.findOne({id: id}, {projection: {_id: 0}})
    },
    async findPostsForSpecificBlog(id: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: any): Promise<PostsType[]> {
        return await postsCollection.find({blogId: id}, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray();
    }
}