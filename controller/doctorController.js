import { doctorModel } from "../models/doctorModel.js";

export const changeAvailablity = async (req, res) => {
  try {
    const { docId } = req.body;

    const docData = await doctorModel.findById(docId);

    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({ success: true, message: "Availability Changed " });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
