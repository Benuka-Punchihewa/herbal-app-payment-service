const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

class ForbiddenError extends CustomAPIError {
  constructor(message, data) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
    this.data = data
  }
}

module.exports = ForbiddenError;
