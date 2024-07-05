import ITodo from "../models/ITodo";

export default interface ITodoRepository {
  create(data: ITodo): Promise<void>
  readTodosByUserId(userId: string): Promise<ITodo[]>
}
