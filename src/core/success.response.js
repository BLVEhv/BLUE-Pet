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
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {}
  ) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super(message, statusCode);
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
