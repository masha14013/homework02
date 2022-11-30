import {Router, Request, Response} from "express";
import {commentsService} from "../domain/comments-service";
import {commentsGetRepository} from "../repositories/comments-get-repository";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {body} from "express-validator";
import {authMiddleware} from "../middlewares/auth-middleware";

export const commentsRouter = Router({})

export const contentValidation = body('content').isString().trim().isLength({
    min: 20,
    max: 300
}).withMessage('Content length should be from 20 to 300 symbols')

commentsRouter.put('/:commentId',
    authMiddleware,
    contentValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {
        let content = req.body.content
        const id = req.params.commentId

        const isUpdated = await commentsService.updateComment(id, content)

        if (isUpdated) {
            //const comment = await commentsGetRepository.findCommentById(id)
            //res.status(204).send(comment)
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })
commentsRouter.get('/:id', async (req: Request, res: Response) => {
    let foundComment = await commentsGetRepository.findCommentById(req.params.id)
    if (!foundComment) {
        res.sendStatus(404)
    } else {
        res.sendStatus(200).send(foundComment)
    }
})
commentsRouter.delete('/:commentId',
    authMiddleware,
    async (req: Request, res: Response) => {
        const commentId = req.params.commentId
        const isDeleted = await commentsService.deleteComment(commentId)
        if (isDeleted) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    })