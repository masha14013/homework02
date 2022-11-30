import {commentsCollection, CommentsType} from "./db";

export const commentsGetRepository = {
    async findCommentById(id: string): Promise<CommentsType | null> {
        return await commentsCollection.findOne({id: id}, {projection: {_id: 0}})
    },
    async findCommentsForSpecificPost(postId: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: any) {
        return await commentsCollection.find({}, {projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()
    },
    async findCommentsForSpecificPostTotalCount(postId: string): Promise<number> {
        return commentsCollection.countDocuments({})
    }
}