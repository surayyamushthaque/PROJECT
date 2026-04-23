import User from "../../../models/user.js";

export const getUsersService = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const search = query.search || "";

  const filter = {
    name: { $regex: search, $options: "i" },
  };

  const users = await User.find(filter)
    .sort({ createdAt: -1 }) // ✅ latest first
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(filter);
  console.log(users)
  return {
    users,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};


export const toggleBlockUserService = async (userId) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  user.isBlocked = !user.isBlocked;
  await user.save();

  return user;
};
export default{
    getUsersService,
    toggleBlockUserService

}