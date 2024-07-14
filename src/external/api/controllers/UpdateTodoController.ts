import { Express, RequestHandler, Response } from "express"
import UpdateTodo from "@/core/todo/services/UpdateTodo";
import errors from "../../../core/shared/errors";
import { ReqWithUser } from "../middlewares/authMiddleware";

export default class UpdateTodoController {
  constructor(
    webServer: Express,
    useCase: UpdateTodo,
    ...middlewares: RequestHandler[]
  ) {

    webServer.patch("/api/todos/:id", ...middlewares, async (req: ReqWithUser, res: Response) => {
      try {

        if (!req.user) {
          throw new Error(errors.ACCESS_DENIED)
        }

        const updatedTodo = {
          id: req.params.id,
          userId: req.user?.id,
          title: req.body.title,
          description: req.body.description,
          completed: req.body.completed
        }

        await useCase.execute(updatedTodo)

        res.status(200).send(updatedTodo)

      } catch (error: any) {
        if (error.message === errors.ACCESS_DENIED) {
          res.status(403).send(error.message)
        } else {
          res.status(500).send(errors.UNEXPECTED_ERROR)
        }
      }
    })
  }
}
