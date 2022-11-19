import {usersCollection, UsersType} from "./db";

export const usersRepository = {
    async createUser(newUser: UsersType): Promise<UsersType> {
        const newUserWithoutId: UsersType = Object.assign({}, newUser)
        await usersCollection.insertOne(newUser)
        return newUserWithoutId;
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