import User from "../../../models/user.js";
import OtpToken from "../../../models/OtpToken.js";
import transporter from "../../../config/mailer.js";

import bcrypt from "bcryptjs";


const getSessionUserId = (req) =>
  req.session.user?._id || req.session.user?.id || req.user?.id;

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const getProfile = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    const user = await User.findById(userId).select("-password");
    // const address = await Address.find({ userId: req.user.id }) || [];
    console.log(user)

    res.render("user/profile/viewProfile",{ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEditProfile = async (req, res) => {
  try {
    const userId = getSessionUserId(req);

    if (!userId) {
      return res.redirect("/user/login");
    }

    const user = await User.findById(userId);

    console.log("USER FROM DB:", user);

    if (!user) {
      return res.redirect("/user/login");
    }

    const changePasswordMessage = req.session.changePasswordMessage || null;
    req.session.changePasswordMessage = null;

    res.render("user/profile/editProfile", { user, changePasswordMessage });

  } catch (err) {
    res.status(500).send(err.message);
  }
};


export const updateProfile = async (req, res) => {
  try {
    console.log("HIT CONTROLLER");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, phone } = req.body;

    const updateData = { name, phone };

    if (req.file) {
      updateData.profileImage = "/images/" + req.file.filename;
    }

    // ✅ safe userId extraction
    const userId = getSessionUserId(req);

    console.log("USER ID:", userId);

    if (!userId) {
      return res.status(400).send("User ID missing");
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { returnDocument: "after" }
    );

    console.log("UPDATED USER:", user);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // ✅ keep session shape consistent with login
    req.session.user = {
      ...(req.session.user || {}),
      id: user._id,
      username: user.name,
    };

    return res.redirect("/user/profile");

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
  const message = req.session.changePasswordMessage || null;
  req.session.changePasswordMessage = null;
  return res.render("user/profile/changePassword", { message });
};

export const postChangePassword = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    if (!userId) return res.redirect("/user/login");

    const currentPassword = (req.body?.currentPassword || "").trim();
    const newPassword = (req.body?.newPassword || "").trim();
    const confirmPassword = (req.body?.confirmPassword || "").trim();

    if (!currentPassword || !newPassword || !confirmPassword) {
      req.session.changePasswordMessage = {
        type: "error",
        text: "All fields are required.",
      };
      return res.redirect("/user/profile/change-password");
    }

    if (newPassword.length < 8) {
      req.session.changePasswordMessage = {
        type: "error",
        text: "New password must be at least 8 characters.",
      };
      return res.redirect("/user/profile/change-password");
    }

    if (newPassword !== confirmPassword) {
      req.session.changePasswordMessage = {
        type: "error",
        text: "New password and confirm password do not match.",
      };
      return res.redirect("/user/profile/change-password");
    }

    const user = await User.findById(userId).select("+password");
    if (!user) {
      req.session.changePasswordMessage = {
        type: "error",
        text: "User not found.",
      };
      return res.redirect("/user/profile/change-password");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password || "");
    if (!isMatch) {
      req.session.changePasswordMessage = {
        type: "error",
        text: "Incorrect current password.",
      };
      return res.redirect("/user/profile/change-password");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    req.session.changePasswordMessage = {
      type: "success",
      text: "Password updated successfully.",
    };

    // Optional enhancement (logout after password change):
    // req.session.destroy(() => res.redirect("/user/login"));
    return res.redirect("/user/profile/change-password");
  } catch (err) {
    req.session.changePasswordMessage = {
      type: "error",
      text: "Failed to update password. Please try again.",
    };
    return res.redirect("/user/profile/change-password");
  }
};

// SEND OTP FOR EMAIL UPDATE
export const sendEmailOtp = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    const newEmail = normalizeEmail(req.body?.newEmail);

    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!newEmail) return res.status(400).json({ message: "Email is required" });

    const currentUser = await User.findById(userId).select("email");
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    if (normalizeEmail(currentUser.email) === newEmail) {
      return res.status(400).json({ message: "New email must be different" });
    }

    const existing = await User.findOne({ email: newEmail }).select("_id");
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const otp = generateOtp();

    // replace any previous pending tokens for this user/email
    await OtpToken.deleteMany({ userId });

    await OtpToken.create({
      userId,
      email: newEmail,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    req.session.pendingEmail = newEmail;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newEmail,
      subject: "Verify your new email",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });
    console.log(otp)
    res.json({ message: "OTP sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVerifyEmailPage = async (req, res) => {
  const pendingEmail = req.session.pendingEmail;
  if (!pendingEmail) return res.redirect("/profile/edit");
  return res.render("user/profile/settingEmail", { pendingEmail, error: null });
};

// VERIFY OTP & UPDATE EMAIL
export const verifyEmailOtp = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    const otp = (req.body?.otp || "").trim();
    const newEmail = normalizeEmail(req.body?.newEmail || req.session.pendingEmail);

    if (!userId) return res.status(401).json({ message: "Not authenticated" });
    if (!newEmail) return res.status(400).json({ message: "Email is required" });
    if (!otp) {
      // render flow (EJS) expects this
      return res.status(400).render("user/profile/settingEmail", {
        pendingEmail: newEmail,
        error: "OTP is required",
      });
    }

    const record = await OtpToken.findOne({
      email: newEmail,
      otp,
      userId,
    });

    if (!record) {
      return res.status(400).render("user/profile/settingEmail", {
        pendingEmail: newEmail,
        error: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).render("user/profile/settingEmail", {
        pendingEmail: newEmail,
        error: "OTP expired",
      });
    }

    await User.findByIdAndUpdate(userId, {
      email: newEmail,
      isEmailVerified: true,
    });

    await OtpToken.deleteMany({ userId });
    req.session.pendingEmail = null;

    return res.redirect("/user/profile");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export default{
    getProfile,
    updateProfile,
    changePassword,
    postChangePassword,
    verifyEmailOtp,
    sendEmailOtp,
    getEditProfile,
    getVerifyEmailPage
}