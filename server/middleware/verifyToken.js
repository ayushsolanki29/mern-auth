import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(403).json({ message: "Unauthorized - Token not Found" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(403).json({ message: "Unauthorized - Invalid token" });
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Something went wrong" });
    console.error(error);
  }
};
