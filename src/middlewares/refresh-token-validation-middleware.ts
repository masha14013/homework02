import {NextFunction, Request, Response} from "express";
import {tokenCollection} from "../repositories/db";
import {jwtService} from "../application/jwt-service";
import {usersGetRepository} from "../repositories/users-get-repository";

export const refreshTokenValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) {
        res.sendStatus(401)
        return
    }
    const refreshTokenFromDB = await tokenCollection.findOne({token: refreshToken})
    if (refreshTokenFromDB) {
        res.sendStatus(401)
        return
    }
    await tokenCollection.insertOne(refreshToken)
    const userId = await jwtService.getUserIdByToken(refreshToken)
    if (!userId) return res.sendStatus(401)

    const user = await usersGetRepository.findUserById(userId.toString())
    if (!user) return res.sendStatus(401)

    req.user = user
    return next()
}