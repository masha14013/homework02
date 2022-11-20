import {Request, Response, Router} from "express";
import {UsersQueryType, UsersType} from "../repositories/db";
import {usersGetRepository} from "../repositories/users-get-repository";
import {authValidationMiddleware} from "../middlewares/auth-validation-middleware";
import {usersService} from "../domain/users-service";
import {query} from "express-validator";
import {createUserValidation} from "../helpers/validation/users-validation";
import {queryParamsParser} from "../helpers/query-params-parser";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

export const usersRouter = Router({})

const pageNumberValidation = query('pageNumber').isInt().toInt(1).default(1)
const pageSizeValidation = query('pageSize').isInt().toInt(10).default(10)

usersRouter.get('/',
    authValidationMiddleware,
    pageSizeValidation,
    pageNumberValidation,
    inputValidationMiddleware,
    async (req: Request<{}, {}, {}, UsersQueryType, {}>, res: Response) => {
        const parsedQuery = queryParamsParser(req.query)
        //console.log(parsedQuery)
        let foundUsers: UsersType[] = await usersGetRepository.findUsers(parsedQuery.pageNumber, parsedQuery.pageSize, parsedQuery.sortBy, parsedQuery.sortDirection, parsedQuery.searchLoginTerm, parsedQuery.searchEmailTerm)
        let foundUsersTotalCount = await usersGetRepository.findUsersTotalCount(parsedQuery.searchLoginTerm, parsedQuery.searchEmailTerm)
        let foundUsersFull = {
            pagesCount: Math.ceil(foundUsersTotalCount / parsedQuery.pageSize),
            page: parsedQuery.pageNumber,
            pageSize: parsedQuery.pageSize,
            totalCount: foundUsersTotalCount,
            items: foundUsers
        }
        res.status(200).send(foundUsersFull)
    })

usersRouter.post('/',
    authValidationMiddleware,
    createUserValidation,
    async (req: Request, res: Response) => {
        let login = req.body.login
        let password = req.body.password
        let email = req.body.email

        const newUser = await usersService.createUser(login, password, email)
        if (!newUser) {
            res.sendStatus(400)
        } else {
            res.status(201).send(newUser)
        }
    })

usersRouter.delete('/:id',
    authValidationMiddleware,
    async (req: Request, res: Response) => {
    const id = req.params.id
    const isDeleted = await usersService.deleteUser(id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }
})