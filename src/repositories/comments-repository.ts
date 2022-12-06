import {commentsCollection, CommentsDBType, CommentsType} from "./db";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async updateComment(id: string, content: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {content: content}
        })
        return result.matchedCount === 1
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },
    async createComment(newComment: any): Promise<CommentsType | undefined> {

        await commentsCollection.insertOne(newComment)
        console.log('newComment', newComment)
        let comment = await commentsCollection.findOne({_id: newComment.id})
        if (comment) {
            return {
                id: comment._id.toString(),
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                createdAt: comment.createdAt
            }
        }
    }
}