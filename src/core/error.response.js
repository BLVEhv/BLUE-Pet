import { httpStatusCode } from "./../utils/httpStatusCode.js";

const StatusCode = {
  FORBIDEN: 403,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FORBIDEN: "Bad request error",
  CONFLICT: "Confict",
};

const httpStatus = {
  statusCode: httpStatusCode.StatusCodes,
  reasonPhrares: httpStatusCode.ReasonPhrases,
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    statusCode = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDEN,
    statusCode = StatusCode.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = reasonPhrares.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

export { ConflictRequestError, BadRequestError, AuthFailureError };
