import errors from "@/core/shared/errors"
import IUser from "@/core/user/models/IUser"
import IPasswordCryptography from "@/core/user/services/IPasswordCryptography"
import IUserRepository from "@/core/user/services/IUserRepository"
import LoginUser, { InputUserData } from "@/core/user/services/LoginUser"

describe("Test LoginUser.ts use case", () => {
  let loginUser: LoginUser
  let mockUserRepository: jest.Mocked<IUserRepository>
  let mockCryptographyService: jest.Mocked<IPasswordCryptography>

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      readByEmail: jest.fn()
    }

    mockCryptographyService = {
      encrypt: jest.fn(),
      compare: jest.fn()
    }

    loginUser = new LoginUser(mockUserRepository, mockCryptographyService)
  })

  it("Should throw an error if the user does not exist", async () => {
    mockUserRepository.readByEmail.mockResolvedValue(null)

    const userDataProvided: InputUserData = {
      email: "john@email.com",
      password: "password123"
    }

    await expect(loginUser.execute(userDataProvided)).rejects.toThrow(errors.USER_DONT_EXISTS)
  })

  it("Should throw an error when the password is incorrect", async () => {
    const dbUser: IUser = {
      id: "1",
      name: "John Doe",
      email: "john@email.com",
      password: "encryptedPassword"
    }

    const userDataProvided: InputUserData = {
      email: "john@email.com",
      password: "incorrectPassword"
    }

    mockUserRepository.readByEmail.mockResolvedValue(dbUser)
    mockCryptographyService.compare.mockReturnValue(false)

    await expect(loginUser.execute(userDataProvided)).rejects.toThrow(errors.INVALID_PASSWORD)
  })

  it("Should return the user without password when the login is successful", async () => {
    const dbUser: IUser = {
      id: "1",
      name: "John Doe",
      email: "john@email.com",
      password: "encryptedPassword"
    }

    const userDataProvided: InputUserData = {
      email: "john@email.com",
      password: "password123"
    }

    mockUserRepository.readByEmail.mockResolvedValue(dbUser)
    mockCryptographyService.compare.mockReturnValue(true)

    const result = await loginUser.execute(userDataProvided)

    expect(result).toEqual({ ...dbUser, password: undefined })
  })
})
