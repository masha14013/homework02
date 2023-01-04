import {UserAccountDBType, usersCollection, UsersType} from "../repositories/db";
import {usersRepository} from "../repositories/users-repository";
import bcrypt from 'bcrypt'
import {ObjectId} from "mongodb";
import {usersGetRepository} from "../repositories/users-get-repository";
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import {emailManager} from "../managers/email-manager";

export const usersService = {
    async createUser(login: string, password: string, email: string): Promise<UsersType | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        const newUser: UserAccountDBType =
            {
                _id: new ObjectId(),
                login,
                email,
                createdAt: new Date().toISOString(),
                accountData: {
                    login,
                    email,
                    passwordHash,
                    passwordSalt,
                    createdAt: new Date().toISOString()
                },
                emailConfirmation: {
                    confirmationCode: uuidv4(),
                    expirationDate: add(new Date(), {
                        hours: 1,
                        minutes: 3
                    }),
                    isConfirmed: false
                }
            }
        const createdUser = await usersRepository.createUser(newUser)
        if(!createdUser) {
            return null
        }
        try {
            await emailManager.sendPasswordRecoveryMessage(createdUser.accountData.email, 'Confirm address', createdUser.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
            await usersRepository.deleteUser(createdUser.id)
            return null
        }
        return createdUser;
    },
    async createUserWithoutEmailSending (login: string, password: string, email: string): Promise<UsersType | null> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)
        /*const newUser: UserAccountDBType =
            {
                _id: new ObjectId(),
                accountData: {
                    login,
                    email,
                    passwordHash,
                    passwordSalt,
                    createdAt: new Date().toISOString()
                },
                emailConfirmation: {
                    confirmationCode: uuidv4(),
                    expirationDate: add(new Date(), {
                        hours: 1,
                        minutes: 3
                    }),
                    isConfirmed: true
                }
            }*/

        const newUser: UserAccountDBType =
            {
                _id: new ObjectId(),
                login,
                email,
                createdAt: new Date().toISOString(),
                accountData: {
                    login,
                    email,
                    passwordHash,
                    passwordSalt,
                    createdAt: new Date().toISOString()
                },
                emailConfirmation: {
                    confirmationCode: uuidv4(),
                    expirationDate: add(new Date(), {
                        hours: 1,
                        minutes: 3
                    }),
                    isConfirmed: true
                }
            }


        const createdUser = await usersRepository.createUser(newUser)
        if(!createdUser) {
            return null
        } else {
            return createdUser
        }
    },
    async updateUserCode(user: any): Promise<boolean> {
        const code = uuidv4()
        const result = await usersCollection.updateOne({_id: new ObjectId(user.id)}, {
            $set: {
                'emailConfirmation.confirmationCode': code
            }
        })
        const updatedUser = await usersCollection.findOne({_id: new ObjectId(user.id)})
        if (!updatedUser) return false
        try {
            await emailManager.sendPasswordRecoveryMessage(user.accountData.email, 'Confirm address', updatedUser.emailConfirmation.confirmationCode)
        } catch (error) {
            console.error(error)
            await usersRepository.deleteUser(user.id)
            return false
        }
        return result.matchedCount === 1
    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    },
    async checkCredentials(loginOrEmail: string, password: string): Promise<UsersType | null> {
        const user = await usersGetRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) return null
        if (!user.emailConfirmation.isConfirmed) return null

        const isHashEquals = await this._isPasswordCorrect(password, user.accountData.passwordHash)
        if (isHashEquals) {
            return user
        } else {
            return null
        }
    },
    async _isPasswordCorrect(password: string, hash: string) {
        const isEqual = await bcrypt.compare(password, hash)
        return isEqual
    },
   /* async checkCredentials(loginOrEmail: string, password: string): Promise<UsersType | null> {
        const user = await usersGetRepository.findByLoginOrEmail(loginOrEmail)
        if(!user) return null
        if (!user.emailConfirmation.isConfirmed) return null

        const passwordHash = await this._generateHash(password, user.accountData.passwordSalt)
        if (user.accountData.passwordHash !== passwordHash) {
            return null
        }
        return user
    },*/
    async _generateHash(password: string, salt: string) {
        const hash = await bcrypt.hash(password, salt)
        return hash
    },
    async confirmCode(code: string): Promise<boolean> {
        let user = await usersRepository.findUserByConfirmationCode(code)
        console.log('user confirm', user)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false

        let result = await usersRepository.updateConfirmation(user._id)
        return result
    }
}