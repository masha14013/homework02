import {commentsRepository} from "../repositories/comments-repository";
import {commentsGetRepository} from "../repositories/comments-get-repository";
import {ObjectId} from "mongodb";
import {CommentsType} from "../repositories/db";

export const commentsService = {
    /*async updateComment(id: string, content: string): Promise<boolean> {
        return await commentsRepository.updateComment(id, content)
    },*/
    async updateComment(comment: string, userId: ObjectId): Promise<boolean> {
        return await commentsRepository.updateComment(comment, userId)
    },
    async deleteComment(id: string): Promise<boolean> {
        return await commentsRepository.deleteComment(id)
    }
}