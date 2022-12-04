import {commentsCollection, CommentsDBType, CommentsType} from "./db";

export const commentsRepository = {
    async updateComment(id: string, content: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({id: id}, {
            $set: {content: content}
        })
        return result.matchedCount === 1
    },
    async deleteComment(commentId: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: commentId})
        return result.deletedCount === 1
    },
    async createComment(newComment: any): Promise<CommentsType | undefined> {
        //const newCommentWithoutId: CommentsType = Object.assign({}, newComment)


        await commentsCollection.insertOne(newComment)
        console.log('newComment.id', newComment.id)
        let comment = await commentsCollection.findOne({id: newComment.id})
        if (comment) {
            return {id: comment._id.toString(),
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                createdAt: comment.createdAt}
        }





    }
}