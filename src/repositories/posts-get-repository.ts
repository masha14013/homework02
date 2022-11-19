import {blogsCollection, BlogsType, postsCollection, PostsType} from "./db";

export const postsGetRepository = {

    async findPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirection: any): Promise<PostsType[]> {
        return await postsCollection.find({}, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray();
    },
    async findPostsTotalCount(filter: Object): Promise<number> {
        return postsCollection.countDocuments(filter ? filter : {})
    },
    async findPostById(id: string): Promise<PostsType | null> {
        return await postsCollection.findOne({id: id}, {projection: {_id: 0}})
    }
}