import request from "supertest"
import express, { Express } from "express"
import RegisterUser from "@/core/user/services/RegisterUser"
import RegisterUserController from "@/external/api/controllers/RegisterUserController"
import IPasswordCryptography from "@/core/user/services/IPasswordCryptography"
import IUserRepository from "@/core/user/services/IUserRepository"
import IUser from "@/core/user/models/IUser"

describe("Test RegisterUserController.ts", () => {
  let app: Express
  let registerUserUseCaseMock: RegisterUser
  let mockCryptographyProvider: jest.Mocked<IPasswordCryptography>
  let mockUserRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    mockCryptographyProvider = {
      encrypt: jest.fn(),
      compare: jest.fn()
    }

    mockUserRepository = {
      create: jest.fn(),
      readByEmail: jest.fn()
    }

    registerUserUseCaseMock = new RegisterUser(mockUserRepository, mockCryptographyProvider)

    jest.spyOn(registerUserUseCaseMock, "execute")

    new RegisterUserController(app, registerUserUseCaseMock)
  })

  it("Shold return 400 when user already existis", async () => {
    (registerUserUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error("User already exists."))

    const user: IUser = {
      name: "John Doe",
      email: "john@email.com",
      password: "P4ssw0rd@123"
    }

    const response = await request(app)
      .post('/api/users/register')
      .send(user)

    expect(response.status).toBe(400)
    expect(response.text).toBe("User already exists.")
    expect(registerUserUseCaseMock.execute).toHaveBeenCalledWith(user)
  })

  it("Should return 400 when user name is invalid", async () => {
    (registerUserUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error("Invalid username. Please, enter a valid value."))

    const user: IUser = {
      name: "",
      email: "john@email.com",
      password: "P4ssw0rd@123"
    }

    const response = await request(app)
      .post("/api/users/register")
      .send(user)

    expect(response.status).toBe(400)
    expect(response.text).toBe("Invalid username. Please, enter a valid value.")
    expect(registerUserUseCaseMock.execute).toHaveBeenCalledWith(user)
  })

  it("Shold return 400 when email is invalid", async () => {
    (registerUserUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error("Invalid email. Please, enter a valid value."))

    const user: IUser = {
      name: "John Doe",
      email: "",
      password: "P4ssw0rd@123"
    }

    const response = await request(app)
      .post("/api/users/register")
      .send(user)

    expect(response.status).toBe(400)
    expect(response.text).toBe("Invalid email. Please, enter a valid value.")
    expect(registerUserUseCaseMock.execute).toHaveBeenCalledWith(user)
  })

  it("Should return 400 when password is invalid", async () => {
    (registerUserUseCaseMock.execute as jest.Mock).mockRejectedValue(new Error("Invalid password. The password must contain at least 8 characters, 1 capital letter, 1 number and 1 special character."))

    const user: IUser = {
      name: "John Doe",
      email: "john@email.com",
      password: "invalid_password"
    }

    const response = await request(app)
      .post("/api/users/register")
      .send(user)

    expect(response.status).toBe(400)
    expect(response.text).toBe("Invalid password. The password must contain at least 8 characters, 1 capital letter, 1 number and 1 special character.")
    expect(registerUserUseCaseMock.execute).toHaveBeenCalledWith(user)
  })

  it("Shold return 201 when user is registred successfully", async () => {
    (registerUserUseCaseMock.execute as jest.Mock).mockResolvedValue(null)

    const user: IUser = {
      name: 'John Doe',
      email: 'john@email.com',
      password: 'password123'
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(user);

    expect(response.status).toBe(201);
    expect(registerUserUseCaseMock.execute).toHaveBeenCalledWith(user);
  })
})
