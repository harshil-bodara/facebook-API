const jwt = require("jsonwebtoken");
const { varifyToken } = require("../services/token.service");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded:", decoded);
    const decoded=varifyToken(token)
    console.log("Decoded:", decoded);

    
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
