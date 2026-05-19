import User from "../../../models/user.js";
import { validateAddress } from "../../../utils/addressValidation.js";

const getSessionUserId = (req) =>
  req.session.user?._id || req.session.user?.id || req.user?.id;

const normalize = (v) => (v || "").toString().trim();



const setFlash = (req, msg) => {
  req.session.addressMessage = msg;
  req.session.flash = {
    type: msg.type === "success" ? "success" : "error",
    title: msg.type === "success" ? "Success" : "Error",
    text: msg.text,
  };
};

const getHeaderUser = (req) => {
  const s = req.session?.user;
  if (!s) return null;
  return { ...s, name: s.name || s.username };
};

export const listAddressesPage = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    if (!userId) return res.redirect("/user/login");

    const user = await User.findById(userId).select("addresses name email");
    const message = req.session.addressMessage || null;
    req.session.addressMessage = null;

    return res.render("user/profile/settingaddres", {
      addresses: user?.addresses || [],
      message,
      user: getHeaderUser(req),
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    if (!userId) return res.redirect("/user/login");

    const validation = validateAddress(req.body);
    if (!validation.ok) {
      setFlash(req, { type: "error", text: validation.message });
      return res.redirect("/user/addresses");
    }

    const user = await User.findById(userId);
    if (!user) {
      setFlash(req, { type: "error", text: "User not found." });
      return res.redirect("/user/addresses");
    }

    user.addresses = user.addresses || [];
    user.addresses.push(validation.value);
    await user.save();

    setFlash(req, { type: "success", text: "Address added successfully." });
    return res.redirect("/user/addresses");
  } catch (err) {
    setFlash(req, { type: "error", text: "Failed to add address." });
    return res.redirect("/user/addresses");
  }
};

export const editAddressPage = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    if (!userId) return res.redirect("/user/login");

    const user = await User.findById(userId).select("addresses");
    const address = user?.addresses?.id(req.params.id);
    if (!address) return res.status(404).send("Address not found");

    const message = req.session.addressMessage || null;
    req.session.addressMessage = null;

    return res.render("user/profile/editAddress", { address, message, user: getHeaderUser(req) });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    if (!userId) return res.redirect("/user/login");

    const validation = validateAddress(req.body);
    if (!validation.ok) {
      setFlash(req, { type: "error", text: validation.message });
      return res.redirect(`/user/addresses/edit/${req.params.id}`);
    }

    const user = await User.findById(userId);
    const address = user?.addresses?.id(req.params.id);
    if (!address) {
      setFlash(req, { type: "error", text: "Address not found." });
      return res.redirect("/user/addresses");
    }

    Object.assign(address, validation.value);
    await user.save();

    setFlash(req, { type: "success", text: "Address updated successfully." });
    return res.redirect("/user/addresses");
  } catch (err) {
    setFlash(req, { type: "error", text: "Failed to update address." });
    return res.redirect(`/user/addresses/edit/${req.params.id}`);
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    if (!userId) return res.redirect("/user/login");

    const user = await User.findById(userId);
    const address = user?.addresses?.id(req.params.id);
    if (!address) {
      setFlash(req, { type: "error", text: "Address not found." });
      return res.redirect("/user/addresses");
    }

    address.deleteOne();
    await user.save();

    setFlash(req, { type: "success", text: "Address deleted successfully." });
    return res.redirect("/user/addresses");
  } catch (err) {
    setFlash(req, { type: "error", text: "Failed to delete address." });
    return res.redirect("/user/addresses");
  }
};

export default {
  listAddressesPage,
  addAddress,
  editAddressPage,
  updateAddress,
  deleteAddress,
};