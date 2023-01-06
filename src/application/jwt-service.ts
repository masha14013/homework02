import {ObjectId} from "mongodb";
import jwt from 'jsonwebtoken';
import {settings} from "../settings";

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
        // jwt => verify // decode
        // decode достаёт все данные из токена не проверяя его "время жизни" и секрет
        // verify достаёт все данные из токена и!!! проверяет его "время жизни" и секрет => если токен уже "умер" или секрет не подходит то метод ВЕРИФАЙ возвращает ошибку
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET)
            return new ObjectId(result.userId)
        } catch (e) {
            return null
        }

    }
}