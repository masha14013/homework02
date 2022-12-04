import {commentsRepository} from "../repositories/comments-repository";
import {CommentsDBType, CommentsType, postsCollection, PostsType} from "../repositories/db";
import {ObjectId} from "mongodb";

export const commentsService = {
    async createComment(content: string, postId: string, user: any): Promise<CommentsType | undefined> {
        const post: PostsType | null = await postsCollection.findOne({id: postId})
        console.log(postId, 'post from service')
        if (post) {
            const newComment = {
                id: ObjectId,
                content: content,
                userId: user.id,
                userLogin: user.login,
                postId: postId,
                createdAt: new Date().toISOString()
            }
            const createdComment = await commentsRepository.createComment(newComment)
            return createdComment
        }
    },
    async updateComment(id: string, content: string): Promise<boolean> {
        return await commentsRepository.updateComment(id, content)
    },
    async deleteComment(commentId: string): Promise<boolean> {
        return await commentsRepository.deleteComment(commentId)
    }
}