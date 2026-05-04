import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;

    let user = await User.findOne({ email });
      if(user){
        if(user.isBlocked){
          return done(null,false,{message:"User is blocked"})
        }
        return done(null,user)
      }

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email,
        password: "GOOGLE_AUTH", // dummy
      });
    }

    return done(null, user);

  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try{
    const user =await User.findById(id);
    if(!user){
      return done(null, false)
    }
    done(null,user)
  }catch(err){
    done(err,null)
  }
  
  
});

export default passport;