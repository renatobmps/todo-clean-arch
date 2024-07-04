import { Express, Request, Response } from "express"
import CreateTodo from "@/core/todo/services/CreateTodo";

export default class CreateTodoController {
  constructor(
    webServer: Express,
    useCase: CreateTodo,
    ...middlewares: any[]
  ) {

    webServer.post("/api/todos/create", ...middlewares, async (req: Request, res: Response) => {
      try {
        await useCase.execute({
          title: req.body.tittle,
          description: req.body.description
        })

        res.status(201).send()

      } catch (error: any) {
        res.status(400).send(error.message)
      }
    })
  }
}
