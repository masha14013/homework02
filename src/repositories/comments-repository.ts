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
        return {
            id: newComment._id?.toString(),
            content: newComment.content,
            userId: newComment.userId,
            userLogin: newComment.userLogin,
            createdAt: newComment.createdAt
        }
    }
}