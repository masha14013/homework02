import {postsCollection, PostsType} from "./db";

export const postsGetRepository = {
    async findPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirectionNumber: number): Promise<PostsType[]> {
        return await postsCollection.find({}, {projection: {_id: 0}})

            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirectionNumber ? 1 : -1})
            .toArray();
    },
    async findPostsTotalCount(): Promise<number> {
        return postsCollection.countDocuments({})
    },
    async findPostById(id: string): Promise<PostsType | null> {
        return await postsCollection.findOne({id: id}, {projection: {_id: 0}})
    }
}