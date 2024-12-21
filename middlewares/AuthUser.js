import jwt from "jsonwebtoken";

export const AuthUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.jwt_Secret);

    req.body.userId = token_decode.id;
    next();
  } catch (error) {}
};
