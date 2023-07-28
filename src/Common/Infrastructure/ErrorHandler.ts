import { Response } from "express";
import { httpResponse } from "./dependencias";
import { HttpResponse } from "./HttpResponse";

export class ErrorHandler {
  private httpResponse: HttpResponse;
  constructor(httpResponse: HttpResponse) {
    this.httpResponse = httpResponse;
  }

  emitResponse(error: Error, response: Response) {
    switch (error.name) {
      case "ValidationError":
      case "CastError":
      case "BSONError":
        return this.httpResponse.badRequest(response, { Error: error.message });
      case "TokenExpiredError":
        return httpResponse.unauthorized(response);
      default:
        return httpResponse.internalServerError(response, {
          Error: "INTERNAL SERVER ERROR",
        });
    }
  }
}
