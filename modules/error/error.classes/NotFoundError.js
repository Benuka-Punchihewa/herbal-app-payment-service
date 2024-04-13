const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends CustomAPIError {
  constructor(message, data) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
    this.data = data
  }
}

module.exports = NotFoundError;
