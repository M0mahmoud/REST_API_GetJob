import Jwt from "jsonwebtoken";

const isAuthenticated = (req, _res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    const error = new Error("Authentication Failed!");
    error.code = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];

  let decodeToken;
  try {
    decodeToken = Jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }

  if (!decodeToken) {
    const error = new Error("Not Authenticated");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodeToken.userId;
  next();
};
export default isAuthenticated;
