const { StatusCodes } = require("http-status-codes");
const InternalServerError = require("./error.classes/InternalServerError");

const errorHandlerMiddleware = async (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "Something went wrong!",
    data: err.data || {},
  };

  console.log(err);

  // handle internal server errors
  if (
    err instanceof InternalServerError ||
    customError.statusCode == StatusCodes.INTERNAL_SERVER_ERROR
  ) {
    customError.message = "Something went wrong!";
  }

  // handle mongo db validation errors
  if (err.name === "ValidationError") {
    let validatorKeyValuePairs = {};
    Object.keys(err.errors).forEach((key) => {
      validatorKeyValuePairs[key] = err.errors[key].message;
    });
    customError.message = "Data validation error!";
    customError.data = validatorKeyValuePairs;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // handle mongo db duplicate value errors
  if (err.code && err.code === 11000) {
    customError.message = `${Object.keys(
      err.keyValue
    )} already exists! Please choose another value.`;

    customError.statusCode = StatusCodes.CONFLICT;
  }

  // handle mongo db cast errors
  if (err.name === "CastError") {
    customError.message = `No item found with ID "${err.value}"!`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  // send JSON response
  return res
    .status(customError.statusCode)
    .json({ message: customError.message, data: customError.data });
};

module.exports = errorHandlerMiddleware;
