import {UsersDBType, UsersType} from "../repositories/db";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {usersGetRepository} from "../repositories/users-get-repository";

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
        return createdUserId;
    }, async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<UsersDBType | null> {
        const user = await usersGetRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) return null
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) {
            return null
        }
        return user
    },
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }
}