import express from "express";
import { taskController } from "../../Common/Infrastructure/dependencias";
import { userAuthorizer } from "../../Common/Infrastructure/Middlewere/userAuthorizer";

const router = express.Router();
router
  .get(
    "/",
    userAuthorizer,
    taskController.getTaskController.bind(taskController)
  )
  .delete(
    "/:id",
    userAuthorizer,
    taskController.deleteTaskController.bind(taskController)
  )
  .post(
    "/",
    userAuthorizer,
    taskController.createTaskController.bind(taskController)
  )
  .put(
    "/:id",
    userAuthorizer,
    taskController.updateTaskController.bind(taskController)
  );

export { router as v1TaskRouter };
