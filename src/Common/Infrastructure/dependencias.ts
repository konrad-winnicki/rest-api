import { DatabaseConnector } from "./DatabaseConnector";
import { MongoUserRepository } from "../../User/Infrastructure/MongoUserRepository";
import { MongoTaskRepository } from "../../Task/Infrastructure/MongoTaskRepository";
import { TaskService } from "../../Task/Application/TaskService";
import { UserService } from "../../User/Application/UserService";
import { UserController } from "../../User/Infrastructure/userControllers";
import { TaskController } from "../../Task/Infrastructure/taskControllers";
import { HttpResponse } from "./HttpResponse";
import dotenv from "dotenv";
import { ErrorHandler } from "./ErrorHandler";
dotenv.config();

if (
  !process.env.DATABASE_URI_PROD ||
  !process.env.DATABASE_URI_DEV ||
  !process.env.DATABASE_URI_TEST
) {
  console.error("Lack of database uri");
  process.exit(1);
}

let DATABASE_URI = "";
switch (process.env.NODE_ENV) {
  case "production":
    DATABASE_URI = process.env.DATABASE_URI_PROD;
    break;
  case "development":
    DATABASE_URI = process.env.DATABASE_URI_DEV;
    break;
  case "test":
    DATABASE_URI = process.env.DATABASE_URI_TEST;
    break;
  case "dev-docs":
    DATABASE_URI = process.env.DATABASE_URI_TEST;
    break;
}

const databaseCredentialsSetup =
  process.env.NODE_ENV === "production"
    ? {
        sslValidate: true,
        tlsCertificateKeyFile: process.env.SSLCERT,
        authMechanism: "MONGODB-X509",
        authSource: "$external",
      }
    : {};

const databaseConnector = new DatabaseConnector(
  DATABASE_URI,
  databaseCredentialsSetup
);

const mongoTaskRepository = new MongoTaskRepository(
  databaseConnector.getUserModel()
);

const mongoUserRepository = new MongoUserRepository(
  databaseConnector.getUserModel()
);

const taskService = new TaskService(mongoTaskRepository);
const userService = new UserService(mongoUserRepository);

const httpResponse = new HttpResponse();
const errorHandler = new ErrorHandler(httpResponse);
const taskController = new TaskController(taskService, httpResponse);
const userController = new UserController(userService, httpResponse);

export {
  databaseConnector,
  httpResponse,
  errorHandler,
  taskController,
  userController,
};
