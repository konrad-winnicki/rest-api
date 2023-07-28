import { User } from "../../User/Domain/User";
import { InputUser } from "../../User/Domain/InputUser";
import { UserRepositoryInterface } from "./UserRepositoryInterface";

export class UserService {
  private userRepositoryInterface: UserRepositoryInterface;
  constructor(userRepositoryInterface: UserRepositoryInterface) {
    this.userRepositoryInterface = userRepositoryInterface;
  }

  public createUser(inputUserDetails: InputUser): Promise<User> {
    return this.userRepositoryInterface.createUser(inputUserDetails);
  }

  public findUserByName(userName: string): Promise<User | null> {
    return this.userRepositoryInterface.findUserByName(userName);
  }

  public deleteUser(userName: string): Promise<boolean> {
    return this.userRepositoryInterface.deleteUser(userName);
  }
}
