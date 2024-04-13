const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

class InternalServerError extends CustomAPIError {
  constructor(message, data) {
    super(message);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    this.data = data
  }
}

module.exports = InternalServerError;
