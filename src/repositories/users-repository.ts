import {usersCollection, UsersType} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async createUser(newUser: UsersType): Promise<ObjectId> {
        //const newUserWithoutId: UsersType = Object.assign({}, newUser)
        //return newUserWithoutId; // insertedId
        const result = await usersCollection.insertOne(newUser)
        return result.insertedId
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({ $or: [{email: loginOrEmail}, {userName: loginOrEmail}]})
        return user
    }
}