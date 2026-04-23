import User from "../../../models/user.js";

const getSessionUserId = (req) =>
  req.session.user?._id || req.session.user?.id || req.user?.id;

const normalize = (v) => (v || "").toString().trim();

const validateAddress = (body) => {
  const name = normalize(body?.name);
  const phone = normalize(body?.phone);
  const street = normalize(body?.street);
  const city = normalize(body?.city);
  const state = normalize(body?.state);
  const pincode = normalize(body?.pincode);
  const country = normalize(body?.country);
  const landmark = normalize(body?.landmark);

  if (!name || !phone || !street || !city || !state || !pincode || !country) {
    return { ok: false, message: "Please fill all required fields." };
  }

  if (!/^\+?[0-9]{10,15}$/.test(phone)) {
    return { ok: false, message: "Phone number is invalid." };
  }

  if (!/^[0-9]{4,10}$/.test(pincode)) {
    return { ok: false, message: "Pincode/ZIP must be numeric." };
  }

  return {
    ok: true,
    value: { name, phone, street, city, state, pincode, country, landmark },
  };
};

const setFlash = (req, msg) => {
  req.session.addressMessage = msg;
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

    return res.render("user/profile/editAddress", { address, message });
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