import request from "supertest"
import express, { Express } from "express"
import RegisterUser from "@/core/user/services/RegisterUser"
import RegisterUserController from "@/external/api/RegisterUserController"
import IPasswordCryptography from "@/core/user/services/IPasswordCryptography"
import IUserRepository from "@/core/user/services/IUserRepository"
import IUser from "@/core/user/models/IUser"


describe("Test RegisterUserController.ts", () => {
  let app: Express
  let registerUser: RegisterUser
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

    registerUser = new RegisterUser(mockCryptographyProvider, mockUserRepository)

    jest.spyOn(registerUser, "execute")

    new RegisterUserController(app, registerUser)
  })


  it("Shold return 201 when user is registred successfully", async () => {
    (registerUser.execute as jest.Mock).mockResolvedValue(null)

    const user: IUser = {
      name: 'John Doe',
      email: 'john@email.com',
      password: 'password123'
    };

    const response = await request(app)
      .post("/api/users/register")
      .send(user);

    expect(response.status).toBe(201);
    expect(registerUser.execute).toHaveBeenCalledWith({
      name: user.name,
      email: user.email,
      password: user.password
    });
  })

  it("Shold return 400 when user registration fails", async () => {
    (registerUser.execute as jest.Mock).mockRejectedValue(new Error("User already exists."))

    const user: IUser = {
      name: "John Doe",
      email: "john@email.com",
      password: "password123"
    }

    const response = await request(app)
      .post('/api/users/register')
      .send(user)

    expect(response.status).toBe(400)
    expect(response.text).toBe("User already exists.")
    expect(registerUser.execute).toHaveBeenCalledWith({
      name: user.name,
      email: user.email,
      password: user.password
    })
  })
})
