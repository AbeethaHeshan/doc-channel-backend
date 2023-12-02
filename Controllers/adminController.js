import Admin from "../models/AdminSchema.js";

export const updateAdmin = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    res.status(200).json({
      success: true,
      message: "Successfully Updated",
      data: updatedAdmin,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update Unsuccessfull",
    });
  }
};

export const deleteAdmin = async (req, res) => {
  const id = req.params.id;

  try {
    await Admin.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully Deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Delete Unsuccessfull",
    });
  }
};

export const getSingleAdmin = async (req, res) => {
  const id = req.params.id;

  try {
    const admin = await Admin.findById(id).select("-password");
    res.status(200).json({
      success: true,
      message: "Admin Found",
      data: admin,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "No Admin found",
    });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    const { query } = req.query;
    let admins;

    if (query) {
      admins = await Admin.find({
        isApproved: "approved",
        $or: [
          { name: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } },
        ],
      }).select("-password");
    } else {
      admins = await Admin.find({ isApproved: "approved" }).select("-password");
    }

    res.status(200).json({
      success: true,
      message: "Doctors Found",
      data: admins,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "No Doctors found",
    });
  }
};

export const getAdminProfile = async (req, res) => {
  const adminId = req.userId;

  try {
    const admin = await Admin.findById(adminId);

    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    const { password, ...rest } = admin._doc;

    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};
