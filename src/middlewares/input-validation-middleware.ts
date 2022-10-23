import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = errors.array({onlyFirstError: true}).map(el => {
            return {
                field: el.param,
                message: el.msg
            }
        })
        res.status(400).json({messagesErrors: error})
    } else {
        next()
    }
}