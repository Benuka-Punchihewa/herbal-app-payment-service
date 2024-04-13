const AuthService = require("./auth.service");

const authorize = (accessRoles) => {
  if (!accessRoles) accessRoles = [];
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const reqBody = {
      authHeader,
      accessRoles,
    };

    const authorizationResponse = await AuthService.authorize(reqBody);
    req.auth = authorizationResponse;
    next();
  };
};

module.exports = { authorize };
