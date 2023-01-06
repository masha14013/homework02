import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersGetRepository} from "../repositories/users-get-repository";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization
    if (!auth) {
        res.status(401).send("Invalid token")
        return
    }

    const authType = auth.split(' ')[0]
    if (authType !== 'Bearer') return res.sendStatus(401)
    const token = auth.split(' ')[1]
    if (!token) return res.sendStatus(401)

    const userId = await jwtService.getUserIdByToken(token)
    if (!userId) return res.sendStatus(401)

    const user = await usersGetRepository.findUserById(userId.toString())
    if (!user) return res.sendStatus(401)

    req.user = user

    return next()
}