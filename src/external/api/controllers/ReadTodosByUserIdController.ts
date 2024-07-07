import ReadTodosByUserId from "@/core/todo/services/ReadTodosByUserId";
import { Express, RequestHandler, Response } from "express"
import { ReqWithUser } from "../middlewares/authMiddleware";

export default class ReadTodosByUserIdController {
  constructor(
    webServer: Express,
    useCase: ReadTodosByUserId,
    ...middlewares: RequestHandler[]
  ) {

    webServer.get("/api/todos", ...middlewares, async (req: ReqWithUser, res: Response) => {
      try {
        if (!req.user) {
          res.status(403).send('Access Denied');
          return;
        }

        const todoList = await useCase.execute(req.user.id!)

        res.status(200).send(todoList)
      } catch (error: any) {
        res.status(400).send(error.message)
      }
    })
  }
}
