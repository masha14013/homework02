import {commentsCollection, CommentsType} from "./db";

export const commentsGetRepository = {
    async findCommentById(id: string): Promise<CommentsType | null> {
        return await commentsCollection.findOne({id: id}, {projection: {_id: 0}})
    },
    async getAllComments() {

    }
}