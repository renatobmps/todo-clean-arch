import IUser from "@/core/user/models/IUser"
import IPasswordCryptography from "@/core/user/services/IPasswordCryptography"
import IUserRepository from "@/core/user/services/IUserRepository"
import LoginUser, { InputUserData } from "@/core/user/services/LoginUser"
import LoginUserController from "@/external/api/controllers/LoginUserController"
import express, { Express } from "express"
import request from "supertest"

jest.mock('@/external/auth/JwtService');

describe("Test LoginUserController.ts", () => {
  let app: Express
  let loginUserUseCaseMock: LoginUser
  let mockUserRepository: jest.Mocked<IUserRepository>
  let mockCryptographyService: jest.Mocked<IPasswordCryptography>

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    mockUserRepository = {
      create: jest.fn(),
      readByEmail: jest.fn()
    }

    mockCryptographyService = {
      encrypt: jest.fn(),
      compare: jest.fn()
    }

    loginUserUseCaseMock = new LoginUser(mockUserRepository, mockCryptographyService)

    new LoginUserController(app, loginUserUseCaseMock)

    jest.spyOn(loginUserUseCaseMock, "execute")
  })

  it("Should return 400 when the credentials are incorrect", async () => {
    (loginUserUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error("Invalid email or password."))

    const user: IUser = { name: "John Doe", email: "john@email.com", password: "wrong_password" }

    mockUserRepository.readByEmail.mockResolvedValue(user)
    mockCryptographyService.compare.mockResolvedValue(false)

    const response = await request(app)
      .post("/api/users/login")
      .send(user)

    expect(response.status).toBe(400)
    expect(response.text).toBe("Invalid email or password.")
    expect(loginUserUseCaseMock.execute).toHaveBeenCalledWith({ email: "john@email.com", password: "wrong_password" })
  })

  it("Should return 400 when the user dont exists", async () => {
    (loginUserUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error("User does not exist."))

    const user: InputUserData = { email: "non_existent_user@email.com", password: "password123" }

    mockUserRepository.readByEmail.mockResolvedValue(null)

    const response = await request(app)
      .post("/api/users/login")
      .send(user)

    expect(response.status).toBe(400)
    expect(response.text).toBe("User does not exist.")
    expect(loginUserUseCaseMock.execute).toHaveBeenCalledWith(user)
  })

  it("Should log in an existing user", async () => {
    (loginUserUseCaseMock.execute as jest.Mock).mockResolvedValue({ name: "John Doe", email: "john@email.com", password: undefined })

    const user: IUser = { name: "John Doe", email: "john@email.com", password: "encryptedP4ssW0rd@123" }

    mockUserRepository.readByEmail.mockResolvedValue(user)
    mockCryptographyService.compare.mockResolvedValue(true)

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "john@email.com", password: "P4ssW0rd@123" })

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      user: { name: "John Doe", email: "john@email.com" }
    })

    expect(loginUserUseCaseMock.execute).toHaveBeenCalledWith({
      email: "john@email.com",
      password: "P4ssW0rd@123"
    })
  })
})
