// middlewares/authMiddleware.js
export const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/user/login");
  }
  next();
};

export default{
    isLoggedIn
}