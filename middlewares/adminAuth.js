export const verifyAdmin = (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect('/login');
  }
  next();
};


export const checkBlocked = (req,res,next)=>{
  if(req.user && req.user.isBlocked){
      return req.logout(()=>{
   res.redirect("/user/login")
    })

  }
  next()
}





export default{
    verifyAdmin,
    checkBlocked
}