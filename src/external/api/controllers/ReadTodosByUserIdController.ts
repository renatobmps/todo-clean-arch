import ReadTodosByUserId from "@/core/todo/services/ReadTodosByUserId";
import { Express, RequestHandler, Response } from "express"
import { ReqWithUser } from "../middlewares/authMiddleware";
import errors from "../../../core/shared/errors";

export default class ReadTodosByUserIdController {
  constructor(
    webServer: Express,
    useCase: ReadTodosByUserId,
    ...middlewares: RequestHandler[]
  ) {

    webServer.get("/api/todos", ...middlewares, async (req: ReqWithUser, res: Response) => {
      try {
        if (!req.user) {
          throw new Error(errors.ACCESS_DENIED)
        }

        const todoList = await useCase.execute(req.user.id!)
        res.status(200).send(todoList)

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
