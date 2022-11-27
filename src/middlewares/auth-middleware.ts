import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersGetRepository} from "../repositories/users-get-repository";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = String(req.headers.authorization.split(' '[1]))

    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersGetRepository.findUserById(userId)
        next()
    }
    res.sendStatus(401)
}