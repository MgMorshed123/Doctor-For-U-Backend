export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details " });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Missing Details " });
    }
  } catch (error) {}
};
