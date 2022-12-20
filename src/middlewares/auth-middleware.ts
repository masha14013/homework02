import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersGetRepository} from "../repositories/users-get-repository";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        res.status(401).send("Invalid token")
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    console.log('route', req.baseUrl+req.path)
    console.log('userId', userId)
    if (userId) {
        req.user = await usersGetRepository.findUserById(userId.toString())

        return next()
    }
    res.status(401).send("Invalid token")
}