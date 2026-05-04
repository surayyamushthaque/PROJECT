import mongoose  from "mongoose"

const adminSchema = new mongoose.Schema({
    email:
    {type:String,
        required:true,
        unique:true
    },
    password:{type:String,
        required:true
    },
    name:String,
    isBlocked:{
        type:Boolean,
        default:false,

    },
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
  }

},{timestamps:true}

)


export default mongoose.model("Admin",adminSchema)