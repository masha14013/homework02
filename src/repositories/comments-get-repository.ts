import {commentsCollection, CommentsType} from "./db";
import {ObjectId} from "mongodb";

export const commentsGetRepository = {
    async findCommentById(id: string): Promise<CommentsType | null> {
        return await commentsCollection.findOne({id: id}, {projection: {_id: 0}})
    },
    async findCommentsForSpecificPost(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: any
    ): Promise<{ id: string; content: string; userId: string; userLogin: string; createdAt: string }[]> {
        const comments = await commentsCollection.find({postId: postId}/*, {projection: {_id: 0}}*/)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        return comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt
        }))
    },
    async findCommentsForSpecificPostTotalCount(postId: string): Promise<number> {
        return commentsCollection.countDocuments({postId: postId})
    }
}