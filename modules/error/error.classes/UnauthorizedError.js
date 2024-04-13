const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

class UnauthorizedError extends CustomAPIError {
  constructor(message, data) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
    this.data = data;
  }
}

module.exports = UnauthorizedError;
