const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

class BadRequestError extends CustomAPIError {
  constructor(message, data) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
    this.data = data;
  }
}

module.exports = BadRequestError;
