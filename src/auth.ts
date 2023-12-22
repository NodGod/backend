

const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
dotenv.config();
const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.params.token || req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).json({error: "A token is required for authentication"});
  }
  try {
      const decoded = jwt.verify(token, config.TOKEN_KEY);
      //res.headers.user = decoded;
      req.headers.role = decoded.role;
      req.headers.organisationId = decoded.organisationId;
      req.headers.approved = decoded.approved;
  } catch (error) {
    return res.status(401).json({error: "Invalid Token"});
  }
  return next();
};

module.exports = verifyToken;