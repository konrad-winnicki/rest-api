import { DatabaseConnector } from "./DatabaseConnector";
import { MongoUserRepository } from "../../User/Infrastructure/MongoUserRepository";
import { MongoTaskRepository } from "../../Task/Infrastructure/MongoTaskRepository";
import { TaskService } from "../../Task/Application/TaskService";
import { UserService } from "../../User/Application/UserService";
import { UserController } from "../../User/Infrastructure/userControllers";
import { TaskController } from "../../Task/Infrastructure/taskControllers";
import { HttpResponse } from "./HttpResponse";
import { ErrorHandler } from "./ErrorHandler";
import sanitizedConfig from "../../config"


let DATABASE_URI = "";
switch (process.env.NODE_ENV) {
  case "prod":
    DATABASE_URI = sanitizedConfig.DATABASE_URI_PROD;
    break;
  case "dev":
    DATABASE_URI = sanitizedConfig.DATABASE_URI_DEV;
    break;
  case "test":
    DATABASE_URI = sanitizedConfig.DATABASE_URI_TEST;
    break;
  case "dev-docs":
    DATABASE_URI = sanitizedConfig.DATABASE_URI_TEST;
    break;
}

const databaseCredentialsSetup =
sanitizedConfig.NODE_ENV === "prod"
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
