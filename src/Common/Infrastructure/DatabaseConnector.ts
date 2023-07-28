import mongoose, { Schema, Model } from "mongoose";
import { User } from "../../User/Domain/User";

export type DataBaseLoginCredentials = {
  sslValidate?: boolean;
  tlsCertificateKeyFile?: string;
  authMechanism?: string;
  authSource?: string;
};

const taskSchema = new Schema({
  name: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, required: true },
});

const userSchema = new Schema({
  name: { type: String, required: true },
  passwordHash: { type: String, required: true },
  tasks: [taskSchema],
});

export class DatabaseConnector {
  public connection;
  private UserModel: Model<User>;
  constructor(uri: string, loginCredentialsSetup: DataBaseLoginCredentials) {
    this.connection = this.openConnection(uri, loginCredentialsSetup);
    this.UserModel = this.connection.model<User>("User", userSchema);
  }

  private openConnection(
    uri: string,
    loginCredentialsSetup: object
  ): mongoose.Connection {
    return mongoose.createConnection(uri, loginCredentialsSetup);
  }

  public getUserModel() {
    return this.UserModel;
  }
}
