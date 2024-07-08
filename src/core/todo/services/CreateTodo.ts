import IUseCase from "@/core/shared/IUseCase"
import ITodo from "../models/ITodo"
import errors from "../../shared/errors"
import ITodoRepository from "./ITodoRepository"

export default class CreateTodo implements IUseCase<ITodo, void> {
  constructor(
    private readonly todoRepository: ITodoRepository
  ) { }

  async execute(data: ITodo): Promise<void> {
    try {
      if (!data.title || data.title.trim() === "") {
        throw new Error(errors.TITLE_REQUIRED)
      }

      if (!data.description || data.description.trim() === "") {
        throw new Error(errors.DESCRIPTION_REQUIRED)
      }

      const newTodo: ITodo = {
        title: data.title,
        description: data.description,
        userId: data.userId
      }

      await this.todoRepository.create(newTodo)

    } catch (error: any) {
      console.error("Error during to-do creation", error)
      throw new Error(error.message)
    }
  }
}
