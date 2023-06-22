import { httpStatusCode } from "./../utils/httpStatusCode.js";

const httpStatus = {
  statusCodes: httpStatusCode.StatusCodes,
  reasonPhrares: httpStatusCode.ReasonPhrases,
};

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message, statusCode);
    this.status = statusCode;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = httpStatus.reasonPhrares.CONFLICT,
    statusCode = httpStatus.statusCodes.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = httpStatus.reasonPhrares.BAD_REQUEST,
    statusCode = httpStatus.statusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class AuthFailureError extends ErrorResponse {
  constructor(
    message = httpStatus.reasonPhrares.UNAUTHORIZED,
    statusCode = httpStatus.statusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = httpStatus.reasonPhrares.NOT_FOUND,
    statusCode = httpStatus.statusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

export {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
  NotFoundError,
};
