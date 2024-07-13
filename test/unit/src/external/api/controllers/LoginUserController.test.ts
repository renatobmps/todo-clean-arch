import errors from "@/core/shared/errors"
import IUser from "@/core/user/models/IUser"
import IPasswordCryptography from "@/core/user/services/IPasswordCryptography"
import IUserRepository from "@/core/user/services/IUserRepository"
import LoginUser, { InputUserData } from "@/core/user/services/LoginUser"
import LoginUserController from "@/external/api/controllers/LoginUserController"
import express, { Express } from "express"
import request from "supertest"
import JwtService from "@/external/auth/JwtService";

jest.mock('@/external/auth/JwtService');

describe("Test LoginUserController.ts", () => {
  let app: Express
  let loginUser: LoginUser
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

    loginUser = new LoginUser(mockUserRepository, mockCryptographyService)

    new LoginUserController(app, loginUser)

    jest.spyOn(loginUser, "execute")


  })

  it("Should log in an existing user", async () => {
    (loginUser.execute as jest.Mock).mockResolvedValue({ id: "1", name: "John Doe", email: "john@email.com", password: undefined })

    const user: IUser = { id: "1", name: "John Doe", email: "john@email.com", password: "encryptedP4ssW0rd@123" }

    mockUserRepository.readByEmail.mockResolvedValue(user)
    mockCryptographyService.compare.mockResolvedValue(true)

    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "john@email.com", password: "P4ssW0rd@123" })

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      user: { id: "1", name: "John Doe", email: "john@email.com" }
    })

    expect(loginUser.execute).toHaveBeenCalledWith({
      email: "john@email.com",
      password: "P4ssW0rd@123"
    })
  })

  it("Should return 400 when the credentials are incorrect", async () => {
    const user: IUser = { id: "1", name: "John Doe", email: "john@email.com", password: "wrongPassword" }

    mockUserRepository.readByEmail.mockResolvedValue(user)
    mockCryptographyService.compare.mockResolvedValue(false)

    const response = await request(app)
      .post("/api/users/login")
      .send(user)

    expect(response.status).toBe(400)
    expect(response.text).toBe(errors.INVALID_CREDENTIALS)
  })

  it("Should return 400 when the user dont exists", async () => {
    const user: InputUserData = { email: "nonExistentUser@email.com", password: "password123" }

    mockUserRepository.readByEmail.mockResolvedValue(null)

    const response = await request(app)
      .post("/api/users/login")
      .send(user)

    expect(response.status).toBe(400)
    expect(response.text).toBe(errors.USER_DONT_EXISTS)
  })
})
