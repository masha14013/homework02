import {usersCollection, UsersType} from "./db";

export const usersGetRepository = {
    async findUsers(pageNumber: number, pageSize: number, sortBy: string, sortDirection: any, searchLoginTerm: string, searchEmailTerm: string) {
        const filter = {
            $or: [{login: {$regex: searchLoginTerm ?? '',$options: "i"}},
                {email: {$regex: searchEmailTerm ?? '', $options: "i"}}]
        }

        return await usersCollection.find(filter)
            .project({_id: 0, passwordHash: 0, passwordSalt: 0})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()
    },
    async findUsersTotalCount(searchLoginTerm: string, searchEmailTerm: string): Promise<number> {
        const filter = {
            $or: [{login: {$regex: searchLoginTerm ?? '', $options: "i"}},
                {password: {$regex: searchEmailTerm ?? '', $options: "i"}}]
        }
        return usersCollection.countDocuments(filter)
    },
    async findUserById(id: string) {
        return await usersCollection.findOne({id: id}, {projection: {_id: 0, passwordHash: 0, passwordSalt: 0}})
    }
}