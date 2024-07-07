import IUser from "../models/IUser";

export default interface IUserRepository {
  create(user: IUser): Promise<void>;
  readByEmail(email: string): Promise<IUser | null>;
};
