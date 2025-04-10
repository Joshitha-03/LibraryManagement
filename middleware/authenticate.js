const { getUser } = require("../service/auth");

function authenticate(req, res, next) {
  const token = req.cookies.uid || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Token missing" });
  }

  const user = getUser(token);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }

  req.user = user; // attach user to request
  next();
}

module.exports = authenticate;
