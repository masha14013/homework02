import {commentsCollection, CommentsType} from "./db";
import {ObjectId} from "mongodb";

export const commentsGetRepository = {
    async findCommentById(id: string): Promise<CommentsType | null> {
        const comment = await commentsCollection.findOne({_id: new ObjectId(id)} )
        if(!comment) {
            return null
        } else {
            return {
                id: comment._id.toString(),
                userLogin: comment.userLogin,
                createdAt: comment.createdAt,
                content: comment.content,
                userId: comment.userId
            }
        }
    },
    async findCommentsForSpecificPost(
        postId: string,
        pageNumber: number,
        pageSize: number,
        sortBy: string,
        sortDirection: any
    ): Promise<{ id: ObjectId; content: string; userId: string; userLogin: string; createdAt: string }[]> {
        const comments = await commentsCollection.find({postId: postId})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        return comments.map(comment => ({
            id: comment._id,
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