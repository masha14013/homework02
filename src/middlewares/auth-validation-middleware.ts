import {NextFunction, Request, Response} from "express";

export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const code = "Basic YWRtaW46cXdlcnR5";
    if (req.headers.authorization !== code) {
        res.sendStatus(401)
    } else {
        next()
    }
}