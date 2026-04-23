import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import session from "express-session"
import passport from "./config/passport.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs")
app.set("views","./views")

app.use(express.static("public"))



app.use(session({
    secret:"mySecretKey123",
    resave:false,
    saveUninitialized:false,

    cookie:{
        secure:false,
        maxAge:10*60*1000,
        httpOnly:true,
    }
}))

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/",userRoutes)
app.use("/admin",adminRoutes)
app.use((req,res,next)=>{
    res.locals.user=req.user||req.session.user
    next()
})



export default app 