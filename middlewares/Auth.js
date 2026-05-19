
import User from "../models/user.js"

export const isLoggedIn = async(req, res, next) => {
  try{
  if (!req.session.user) {
    return res.redirect("/user/login");
  }
  const user = await User.findById(req.session.user.id)

  if(!user){
    req.session.destroy()
    return res.redirect("/user/login")
  }
  if(user.isBlocked){
    req.session.destroy()
    return res.redirect("/user/login")
  }

 req.user = user
  next();
} catch(err){
  console.log(err)
  return res.redirect("/user/login")
}
}


export const  authMiddleware = async(req, res, next) => {
  try{
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
    const user = await User.findById(req.session.user.id);
    if (!user) {
      req.session.destroy();

      return res.status(401).json({
        message: "User not found"
      });
    }

    if (user.isBlocked) {

      req.session.destroy();

      return res.status(403).json({
        message: "Account blocked"
      });
    }

    req.user = user;

  next();

}
 catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server error"
    });
  }
}



export default{
    isLoggedIn,
    authMiddleware
 }