import { validationResult } from "express-validator";

const handleValidation = (req,res,next)=>{
    const errors=validationResult(req)

  if(!errors.isEmpty()){
    return res.render("signup",{
        errors:errors.array(),
        old:req.body
    })
  }
  next()

}

export default handleValidation