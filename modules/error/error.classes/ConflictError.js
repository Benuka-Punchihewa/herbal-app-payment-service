const CustomAPIError = require("./CustomAPIError");
const { StatusCodes } = require("http-status-codes");

class ConflictError extends CustomAPIError {
  constructor(message, data) {
    super(message);
    this.statusCode = StatusCodes.CONFLICT;
    this.data = data;
  }
}

module.exports = ConflictError;
