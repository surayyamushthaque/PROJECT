export const verifyAdmin = (req, res, next) => {
  if (!req.session.admin) {
    return res.status(401).send("Admin not logged in");
  }
  next();
};

export default{
    verifyAdmin
}