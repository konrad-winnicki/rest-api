import express from "express";
import { userAuthorizer } from "../../Common/Infrastructure/Middlewere/userAuthorizer";
import { userController } from "../../Common/Infrastructure/dependencias";

const router = express.Router();
router
  .post("/", userController.createUserController.bind(userController))
  .delete(
    "/:id",
    userAuthorizer,
    userController.deleteUserController.bind(userController)
  )
  .post("/login", userController.loginController.bind(userController));

export { router as v1UserRouter };
