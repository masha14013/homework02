import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken';
import {settings} from "../settings";
import {UsersType} from "../repositories/db";

export const jwtService = {
    async createAccessJWT(userId: string | null) {
        const accessToken = jwt.sign({userId: userId}, settings.JWT_SECRET, {expiresIn: '10s'})
        return accessToken
    },
    async createRefreshJWT(userId: string | null) {
        const refreshToken = jwt.sign({userId: userId}, settings.JWT_SECRET, {expiresIn: '20s'})
        return refreshToken
    },
    async getUserIdByToken(token: string) {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
    }
}