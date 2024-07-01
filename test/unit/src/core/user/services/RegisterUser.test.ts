import errors from "@/core/shared/errors"
import IUser from "@/core/user/models/IUser"
import IPasswordCryptography from "@/core/user/services/IPasswordCryptography"
import IUserRepository from "@/core/user/services/IUserRepository"
import RegisterUser from "@/core/user/services/RegisterUser"

describe("Test RegisterUser.ts use case", () => {
  let registerUser: RegisterUser;
  let mockCryptographyProvider: jest.Mocked<IPasswordCryptography>;
  let mockUserRepository: jest.Mocked<IUserRepository>

  beforeEach(() => {
    mockCryptographyProvider = {
      encrypt: jest.fn(),
      compare: jest.fn()
    }

    mockUserRepository = {
      create: jest.fn(),
      readByEmail: jest.fn()
    }

    registerUser = new RegisterUser(mockCryptographyProvider, mockUserRepository)
  })

  it("Should successfully register a new user", async () => {
    const newUser: IUser = { name: "John Doe", email: "john@email.com", password: "password123" }

    mockUserRepository.readByEmail.mockResolvedValue(null)
    mockCryptographyProvider.encrypt.mockReturnValue("encryptedPassword")

    await registerUser.execute(newUser)

    expect(mockUserRepository.readByEmail).toHaveBeenCalledWith(newUser.email)
    expect(mockCryptographyProvider.encrypt).toHaveBeenCalledWith(newUser.password)
    expect(mockUserRepository.create).toHaveBeenCalledWith({
      name: newUser.name,
      email: newUser.email,
      password: "encryptedPassword"
    })
  })

  it("Should throw an error if user already exists", async () => {
    const user: IUser = { name: "John Doe", email: "john@email.com", password: "password123" }

    mockUserRepository.readByEmail.mockResolvedValue(user)

    await expect(registerUser.execute(user)).rejects.toThrow(errors.USER_EXISTS)
    expect(mockCryptographyProvider.encrypt).not.toHaveBeenCalled()
    expect(mockUserRepository.create).not.toHaveBeenCalled()
  })
})
