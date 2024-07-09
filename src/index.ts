import dotenv from "dotenv"
import express from "express"
import RegisterUserController from "./external/api/controllers/RegisterUserController"
import RegisterUser from "./core/user/services/RegisterUser"
import UserRepository from "./external/database/UserRepository"
import BcryptCryptography from "./external/auth/BcryptCryptography"
import LoginUser from "./core/user/services/LoginUser"
import LoginUserController from "./external/api/controllers/LoginUserController"
import TodoRepository from "./external/database/TodoRepository"
import CreateTodo from "./core/todo/services/CreateTodo"
import CreateTodoController from "./external/api/controllers/CreateTodoController"
import authMiddleware from "./external/api/middlewares/authMiddleware"
import ReadTodosByUserId from "./core/todo/services/ReadTodosByUserId"
import ReadTodosByUserIdController from "./external/api/controllers/ReadTodosByUserIdController"
import UpdateTodo from "./core/todo/services/UpdateTodo"
import UpdateTodoController from "./external/api/controllers/UpdateTodoController"
import DeleteTodo from "./core/todo/services/DeleteTodo"
import DeleteTodoController from "./external/api/controllers/DeleteTodoController"

dotenv.config({ path: ".env.development" })

const app = express()
const PORT = process.env.API_PORT ?? 4000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.listen(PORT, () => {
  console.info(`Server running on port ${PORT}`)
})

const userRepository = new UserRepository()
const cryptographyService = new BcryptCryptography()
const todoRepository = new TodoRepository()

const auth = authMiddleware(userRepository)

const registerUserUseCase = new RegisterUser(userRepository, cryptographyService)
const loginUserUseCase = new LoginUser(userRepository, cryptographyService)
const createTodoUseCase = new CreateTodo(todoRepository)
const readTodosByUserIdUseCase = new ReadTodosByUserId(todoRepository)
const updateTodoUseCase = new UpdateTodo(todoRepository)
const deleteTodoUseCase = new DeleteTodo(todoRepository)

new RegisterUserController(app, registerUserUseCase)
new LoginUserController(app, loginUserUseCase)
new CreateTodoController(app, createTodoUseCase, auth)
new ReadTodosByUserIdController(app, readTodosByUserIdUseCase, auth)
new UpdateTodoController(app, updateTodoUseCase, auth)
new DeleteTodoController(app, deleteTodoUseCase, auth)
