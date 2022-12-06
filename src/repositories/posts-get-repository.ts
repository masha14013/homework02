import {postsCollection, PostsType} from "./db";
import {ObjectId} from "mongodb";

export const postsGetRepository = {

    async findPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirection: any): Promise<PostsType[]> {
        return await postsCollection.find({}/*, {projection: {_id: 0}}*/)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray();
    },
    async findPostsTotalCount(filter: Object): Promise<number> {
        return postsCollection.countDocuments(filter ? filter : {})
    },
    async findPostById(id: string): Promise<PostsType | null> {
        const post = await postsCollection.findOne({_id: new ObjectId(id)})
        if(post) {
            // @ts-ignore
            delete Object.assign(post, {["id"]: post["_id"]})["_id"];
        }
        return post
    }
}