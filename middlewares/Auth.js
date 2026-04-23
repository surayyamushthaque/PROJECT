// middlewares/authMiddleware.js
export const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/user/login");
  }
  next();
};

export const  authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
   req.user = { id: req.session.user.id };

  next();
};

export default{
    isLoggedIn,
    authMiddleware
}