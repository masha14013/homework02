import {UsersType} from "../repositories/db";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<ObjectId> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser: UsersType =
            {
                id: (+(new Date())).toString(),
                login,
                email,
                passwordHash,
                passwordSalt,
                createdAt: new Date().toISOString()
            }
        const createdUserId = await usersRepository.createUser(newUser)
        return createdUserId; //insertedID
    }, async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async checkCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return false
        }
        return true
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}