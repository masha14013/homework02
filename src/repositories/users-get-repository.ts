import {EmailConfirmationType, UserAccountDBType, UserAccountType, usersCollection, UsersType} from "./db";
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
    async findUserById(id: string): Promise<UsersType | null> {
        let user = await usersCollection.findOne({_id: new ObjectId(id)})
        if (!user) {
            return null
        } else {
            return {
                id: user._id.toString(),
                accountData: user.accountData,
                emailConfirmation: user.emailConfirmation
            }
        }
    },
    async findByLoginOrEmail(loginOrEmail: string): Promise<UsersType | null> {
        //const user = await usersCollection.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
        const user = await usersCollection.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.userName": loginOrEmail}]})
        if (!user) return null
        return {
            id: user._id.toString(),
            accountData: user.accountData,
            emailConfirmation: user.emailConfirmation
        }
    },
    /*async findUserByLoginOrEmail(login: string, email: string): Promise<boolean> {
        const user = await usersCollection.findOne({$or: [{'accountData.email': email}, {'accountData.login': login}]})
        if (!user) return false
        return true
    },*/
    async findUserByLogin(login: string): Promise<boolean> {
        const user = await usersCollection.findOne({'accountData.login': login})
        if (!user) return false
        return true
    },
    async findUserByEmail(email: string): Promise<boolean> {
        const user = await usersCollection.findOne({'accountData.email': email})
        if (!user) return false
        return true
    },
    async findCurrentUser() {

    }
}