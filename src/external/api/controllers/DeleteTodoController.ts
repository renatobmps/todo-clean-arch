import { Express, RequestHandler, Response } from "express"
import DeleteTodo from "@/core/todo/services/DeleteTodo";
import errors from "../../../core/shared/errors";
import { ReqWithUser } from "../middlewares/authMiddleware";

export default class DeleteTodoController {
  constructor(
    webServer: Express,
    useCase: DeleteTodo,
    ...middlewares: RequestHandler[]
  ) {

    webServer.delete("/api/todos/:id", ...middlewares, async (req: ReqWithUser, res: Response) => {
      try {
        await useCase.execute({
          id: req.params.id,
          userId: req.user?.id
        })

        res.status(200).send()

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
