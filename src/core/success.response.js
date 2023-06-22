import { httpStatusCode } from "./../utils/httpStatusCode.js";

const httpStatus = {
  statusCodes: httpStatusCode.StatusCodes,
  reasonPhrares: httpStatusCode.ReasonPhrases,
};

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "Success",
  CREATED: "Created",
};

class SuccessResponse {
  constructor(
    message,
    statusCode = httpStatus.statusCodes.OK,
    reasonStatusCode = httpStatus.reasonPhrares.OK
  ) {
    this.message = !message ? reasonStatusCode : message;
    this.statusCode = statusCode;
  }
}

class OK extends SuccessResponse {
  constructor(
    message,
    statusCode,
    reasonStatusCode,
    metadata = {},
    errorStatus
  ) {
    super(message, statusCode, reasonStatusCode, metadata);
    this.errorStatus = errorStatus;
  }
  send(res) {
    return res.status(this.errorStatus || this.statusCode).json(this);
  }
}

class CREATED extends SuccessResponse {
  constructor(
    message,
    reasonStatusCode = ReasonStatusCode.CREATED,
    statusCode = StatusCode.CREATED,
    metadata = {}
  ) {
    super({ message, reasonStatusCode, statusCode, metadata });
  }
}

export { OK, CREATED, SuccessResponse };
