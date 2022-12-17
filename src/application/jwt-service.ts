import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken';
import {settings} from "../settings";
import {UserAccountDBType, UsersType} from "../repositories/db";

export const jwtService = {
    async createJWT(user: UsersType | null) {
        const token = jwt.sign({userId: user!.id}, settings.JWT_SECRET, {expiresIn: '10d'})
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (error) {
            return null
        }
    }
}