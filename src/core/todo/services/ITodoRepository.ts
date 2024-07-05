import ITodo from "../models/ITodo";

export default interface ITodoRepository {
  create(data: ITodo): Promise<void>
  readAllByUserId(userId: string): Promise<ITodo[]>
}
