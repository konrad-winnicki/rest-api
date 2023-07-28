import { User } from "../../User/Domain/User";
import { InputUser } from "../Domain/InputUser";

export interface UserRepositoryInterface {
  createUser(inputUserDetails: InputUser): Promise<User>;
  deleteUser(userId: string): Promise<boolean>;
  findUserByName(userName: string): Promise<User | null>;
}
