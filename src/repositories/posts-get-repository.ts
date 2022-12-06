import {postsCollection, PostsType} from "./db";
import {ObjectId} from "mongodb";

export const postsGetRepository = {

    async findPosts(pageNumber: number, pageSize: number, sortBy: string, sortDirection: any): Promise<{ createdAt: string; blogName: string; id: ObjectId; shortDescription: string; title: string; blogId: string; content: string }[]> {
        const posts = await postsCollection.find({})
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