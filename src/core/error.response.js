const StatusCode = {
  FORBIDEN: 403,
  CONFLICT: 409,
};

const ReasonStatusCode = {
  FORBIDEN: "Bad request error",
  CONFLICT: "Confict",
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

export { ConflictRequestError, BadRequestError };
