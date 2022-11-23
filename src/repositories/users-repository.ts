import {usersCollection, UsersType} from "./db";

export const usersRepository = {
    async createUser(newUser: UsersType): Promise<string> {
        //const newUserWithoutId: UsersType = Object.assign({}, newUser)
        //return newUserWithoutId; // insertedId
        const result = await usersCollection.insertOne(newUser)
        return String(result.insertedId)
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