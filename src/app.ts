import express, { Express, Request, Response, NextFunction } from "express";
import { v1TaskRouter } from "./Task/Infrastructure/v1taskRouter";
import {v1UserRouter} from "./User/Infrastructure/v1userRouter";
import { errorHandler } from "./Common/Infrastructure/dependencias";
import cors from "cors";
import expressOasGenerator, {SPEC_OUTPUT_FILE_BEHAVIOR} from 'express-oas-generator';

export const app: Express = express();
expressOasGenerator.handleResponses(app, {specOutputFileBehavior: SPEC_OUTPUT_FILE_BEHAVIOR.PRESERVE, swaggerDocumentOptions: {}});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next: NextFunction) => {
  res.set("Cache-Control", "no-cache");
  next();
});

app.use("/api/v1/users", v1UserRouter);
app.use("/api/v1/tasks", v1TaskRouter);

app.use(
  (error: Error, _req: Request, res: Response, next:NextFunction): void => {
    if (res.headersSent) {
      return next(error);
    }
    errorHandler.emitResponse(error, res)}
);

expressOasGenerator.handleRequests();

app.use((_request: Request, response: Response): void => {
  response.status(404).json({ Error: "Endpoint not found" });
});

