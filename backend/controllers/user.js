import User from "../models/user.js";
import  bcrypt  from 'bcrypt';


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    delete user.password;

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user profile", error);
    res.status(500).json({ message: "Server error" });
  }
};



const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

     const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({message: "Password updated successfully"});
  } catch (error) {
    console.error("Error changing password", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    const avatarPath = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = avatarPath;
    await user.save();

    res.status(200).json({ profilePicture: avatarPath });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export {changePassword, updateUserProfile, getUserProfile,  }
