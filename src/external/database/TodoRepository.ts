import ITodo from "@/core/todo/models/ITodo"
import ITodoRepository from "@/core/todo/services/ITodoRepository"
import db from "./db"
import { IDeleteTodoData } from "@/core/todo/services/DeleteTodo"

export default class TodoRepository implements ITodoRepository {
  async create(todo: ITodo): Promise<void> {
    await db.query(
      "INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3)",
      [todo.userId!, todo.title, todo.description]
    )
  }

  async readTodosByUserId(userId: string): Promise<ITodo[]> {
    const response = await db.query(
      "SELECT * FROM todos WHERE user_id = $1",
      [userId]
    )

    return response?.rows!
  }

  async update({ title, description, completed, id, userId }: ITodo): Promise<void> {
    const valuesToUpdate = []

    let queryString = "UPDATE todos SET "

    if (title !== undefined) {
      valuesToUpdate.push(title)
      queryString += `title = $${valuesToUpdate.length}, `
    }

    if (description !== undefined) {
      valuesToUpdate.push(description)
      queryString += `description = $${valuesToUpdate.length}, `
    }

    if (completed !== undefined) {
      valuesToUpdate.push(completed)
      queryString += `completed = $${valuesToUpdate.length}, `
    }

    queryString = queryString.slice(0, -2)

    valuesToUpdate.push(id!)
    queryString += ` WHERE id = $${valuesToUpdate.length}`

    valuesToUpdate.push(userId!)
    queryString += ` AND user_id = $${valuesToUpdate.length}`

    await db.query(queryString, valuesToUpdate)
  }

  async delete({ id, userId }: IDeleteTodoData): Promise<number> {
    const result = await db.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2",
      [id!, userId!]
    )

    return result?.rowCount!
  }
}
