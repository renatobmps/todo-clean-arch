import CreateTodo from "@/core/todo/services/CreateTodo"
import { RequestHandler, Response, Express } from "express"
import { ReqWithUser } from "../middlewares/authMiddleware"
import errors from "../../../core/shared/errors"

export default class CreateTodoController {
  constructor(
    webServer: Express,
    useCase: CreateTodo,
    ...middlewares: RequestHandler[]
  ) {

    webServer.post("/api/todos/create", ...middlewares, async (req: ReqWithUser, res: Response) => {
      try {
        await useCase.execute({
          userId: req.user!.id,
          title: req.body.title,
          description: req.body.description
        })

        res.status(201).send()

      } catch (error: any) {
        if (
          error.message === errors.TITLE_REQUIRED ||
          error.message === errors.DESCRIPTION_REQUIRED
        ) {
          res.status(400).send(error.message)
        } else {
          res.status(500).send(errors.UNEXPECTED_ERROR)
        }
      }
    })
  }
}
