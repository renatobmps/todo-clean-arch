import request from 'supertest';
import express, { Express } from 'express';
import LoginUser from '@/core/user/services/LoginUser';
import LoginUserController from "@/external/api/LoginUserController"
import IUserRepository from '@/core/user/services/IUserRepository';
import IPasswordCryptography from '@/core/user/services/IPasswordCryptography';
import IUser from '@/core/user/models/IUser';
import errors from '@/core/shared/errors';

describe("Test LoginUserController.ts", () => {
  let app: Express;
  let loginUser: LoginUser;
  let userRepositoryMock: jest.Mocked<IUserRepository>;
  let cryptographyServiceMock: jest.Mocked<IPasswordCryptography>;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))

    userRepositoryMock = {
      create: jest.fn(),
      readByEmail: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    cryptographyServiceMock = {
      encrypt: jest.fn(),
      compare: jest.fn(),
    } as jest.Mocked<IPasswordCryptography>;

    loginUser = new LoginUser(userRepositoryMock, cryptographyServiceMock);

    new LoginUserController(app, loginUser);
  });

  it("Should log in an existing user", async () => {
    const user: IUser = { id: '1', name: 'Test User', email: 'test@example.com', password: 'encryptedPassword' };
    userRepositoryMock.readByEmail.mockResolvedValue(user);
    cryptographyServiceMock.compare.mockReturnValue(true);

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: '1', name: 'Test User', email: 'test@example.com' });
  });





  it('should return 400 if login credentials are incorrect', async () => {
    const errorMessage = errors.INVALID_CREDENTIALS;
    userRepositoryMock.readByEmail.mockResolvedValue({ id: '1', name: 'Test User', email: 'test@example.com', password: 'encryptedPassword' });
    cryptographyServiceMock.compare.mockReturnValue(false);

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'test@example.com', password: 'wrongPassword' });

    expect(response.status).toBe(400);
    expect(response.text).toBe(errorMessage);
  });






  it('should return 400 if user does not exist', async () => {
    const errorMessage = errors.USER_DONT_EXISTS;
    userRepositoryMock.readByEmail.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' });

    expect(response.status).toBe(400);
    expect(response.text).toBe(errorMessage);
  });
});