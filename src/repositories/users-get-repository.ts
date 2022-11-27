import {usersCollection, UsersDBType, UsersType} from "./db";
import {ObjectId} from "mongodb";

export const usersGetRepository = {
    async findUsers(pageNumber: number, pageSize: number, sortBy: string, sortDirection: any, searchLoginTerm: string, searchEmailTerm: string) {
        const filter = {
            $or: [{login: {$regex: searchLoginTerm ?? '', $options: "i"}},
                {email: {$regex: searchEmailTerm ?? '', $options: "i"}}]
        }

        return await usersCollection.find(filter, {projection: {_id: 0, passwordHash: 0, passwordSalt: 0}})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        /*return await usersCollection.find(filter)
            .project({_id: 0, passwordHash: 0, passwordSalt: 0})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()*/
    },
    async findUsersTotalCount(searchLoginTerm: string, searchEmailTerm: string): Promise<number> {
        const filter = {
            $or: [{login: {$regex: searchLoginTerm ?? '', $options: "i"}},
                {email: {$regex: searchEmailTerm ?? '', $options: "i"}}]
        }
        return usersCollection.countDocuments(filter)
    },
    async findUserById(id: ObjectId): Promise<UsersType | null> {
        return usersCollection.findOne({_id: id}, {projection: {_id: 0, passwordHash: 0, passwordSalt: 0}})
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<UsersDBType | null> {
        const user = await usersCollection.findOne({ $or: [{email: loginOrEmail}, {login: loginOrEmail}]})
        return user
    },
    async findCurrentUser() {

    }
}