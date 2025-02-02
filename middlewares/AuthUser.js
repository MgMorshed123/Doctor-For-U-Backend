import jwt from "jsonwebtoken";

export const AuthUser = async (req, res, next) => {
  try {
    const { token } = req.headers;

    // console.log("token", token);

    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(token, process.env.jwt_Secret);
    console.log(token_decode);

    req.body.userId = token_decode.id;
    // console.log(req.body.userId);
    next();
  } catch (error) {}
};
