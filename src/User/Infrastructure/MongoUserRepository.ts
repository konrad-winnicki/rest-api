import { Model } from "mongoose";
import { InputUser } from "../Domain/InputUser";
import { User } from "../../User/Domain/User";
import { UserRepositoryInterface } from "../../User/Application/UserRepositoryInterface";

export class MongoUserRepository implements UserRepositoryInterface {
  private UserModel: Model<User>;
  constructor(UserModel: Model<User>) {
    this.UserModel = UserModel;
  }

  public async deleteUser(userId: string): Promise<true | false> {
    return this.UserModel.deleteOne({ _id: userId })
      .then((deletedUser) => {
        return deletedUser.deletedCount === 1 ? true : false;
      })
      .catch((error: Error) => {
        throw error;
      });
  }

  public async createUser(inputUserDetails: InputUser): Promise<User> {
    return this.UserModel.create(inputUserDetails)
      .then((createdUser) => {
        return new User(
          createdUser.id,
          createdUser.name,
          createdUser.passwordHash,
          createdUser.tasks
        );
      })
      .catch((error) => {
        throw error;
      });
  }

  public async findUserByName(searchedName: string): Promise<User | null> {
    return this.UserModel.findOne({ name: searchedName })
      .then((foundUser) => {
        return foundUser
          ? new User(
              foundUser.id,
              foundUser.name,
              foundUser.passwordHash,
              foundUser.tasks
            )
          : null;
      })
      .catch((error) => {
        throw error;
      });
  }
}


