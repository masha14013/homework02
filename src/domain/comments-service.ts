import {commentsRepository} from "../repositories/comments-repository";
import {commentsGetRepository} from "../repositories/comments-get-repository";
import {ObjectId} from "mongodb";
import {CommentsType, postsCollection, PostsType} from "../repositories/db";

export const commentsService = {
    /*async updateComment(id: string, content: string): Promise<boolean> {
        return await commentsRepository.updateComment(id, content)
    },*/
    async createComment(content: string, postId: string, user: any): Promise<CommentsType | undefined> {
        const post: PostsType | null = await postsCollection.findOne({id: postId})
        if (post) {
            const newComment: CommentsType = {
                id: (+(new Date())).toString(),
                content: content,
                userId: user.userId,
                userLogin: user.userLogin,
                createdAt: new Date().toISOString()
            }
            const createdComment = await commentsRepository.createComment(newComment)
            return createdComment
        }
    },
    async updateComment(comment: string, userId: ObjectId): Promise<boolean> {
        return await commentsRepository.updateComment(comment, userId)
    },
    async deleteComment(id: string): Promise<boolean> {
        return await commentsRepository.deleteComment(id)
    }
}