import jwt from "jsonwebtoken";

export const AuthDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    // console.log("tokennn", dtoken);

    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    const token_decode = jwt.verify(dtoken, process.env.jwt_Secret);
    console.log(token_decode);

    req.body.docId = token_decode.id;
    // console.log(req.body.userId);
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
