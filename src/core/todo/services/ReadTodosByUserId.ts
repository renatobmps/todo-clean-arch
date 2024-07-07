import IUseCase from "@/core/shared/IUseCase";
import ITodo from "../models/ITodo";
import ITodoRepository from "./ITodoRepository";
import IUserRepository from "@/core/user/services/IUserRepository";
import errors from "../../shared/errors";

export default class ReadTodosByUserId implements IUseCase<string, ITodo[]> {
  constructor(
    private readonly todoRepository: ITodoRepository,
    private readonly userRepository: IUserRepository
  ) { }

  async execute(userId: string): Promise<ITodo[]> {

    const dbUser = await this.userRepository.readById(userId)

    if (!dbUser) {
      throw new Error(errors.USER_DONT_EXISTS)
    }

    return await this.todoRepository.readTodosByUserId(userId)
  }
}
