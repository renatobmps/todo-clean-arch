import IUseCase from "@/core/shared/IUseCase";
import ITodo from "../models/ITodo";
import errors from "@/core/shared/errors";
import ITodoRepository from "./ITodoRepository";

export default class CreateTodo implements IUseCase<ITodo, void> {
  constructor(
    private readonly todoRepository: ITodoRepository
  ) { }

  async execute(data: ITodo): Promise<void> {
    if (!data.title || data.title === "") {
      throw new Error(errors.TITLE_REQUIRED)
    }

    if (!data.description || data.description === "") {
      throw new Error(errors.DESCRIPTION_REQUIRED)
    }

    const newTodo: ITodo = {
      title: data.title,
      description: data.description,
    }

    return this.todoRepository.create(newTodo)
  }
}
