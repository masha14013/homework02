import {usersCollection, UserAccountDBType, UsersType} from "./db";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async createUser (newUser: UserAccountDBType): Promise<UsersType | null> {
        const result = await usersCollection.insertOne(newUser)
        console.log('result', result)
        if(!result.acknowledged) {
            return null
        }
        return {
            id: newUser._id.toString(),
            accountData: newUser.accountData,
            emailConfirmation: newUser.emailConfirmation
        }
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },
    async findUserByConfirmationCode(code: string) {
        const user = await usersCollection.findOne({'emailConfirmation.confirmationCode': code})
        console.log('user from code', user)
        return user
    },
    async updateConfirmation(_id: ObjectId) {
        let result = await usersCollection.updateOne({_id: _id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.modifiedCount === 1
    }
}