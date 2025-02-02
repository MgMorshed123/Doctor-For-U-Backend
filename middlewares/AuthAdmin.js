import jwt from "jsonwebtoken";

export const AuthAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    // console.log(atoken);
    if (!atoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(atoken, process.env.jwt_Secret);

    if (token_decode !== process.env.Admin_Email + process.env.Admin_Password) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    next();
  } catch (error) {}
};
