import {commentsCollection, CommentsType} from "./db";
import {ObjectId} from "mongodb";

export const commentsRepository = {
    async updateComment(comment: string, userId: ObjectId): Promise<boolean> {
        const result = await commentsCollection.updateOne({_id: userId}, {
            $set: {content: comment}
        })
        return result.matchedCount === 1
    },
    async deleteComment(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async createComment(newComment: CommentsType): Promise<CommentsType | undefined> {
        const newCommentWithoutId: CommentsType = Object.assign({}, newComment)
        await commentsCollection.insertOne(newComment)
        return newCommentWithoutId;
    }
}