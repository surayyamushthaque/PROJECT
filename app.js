import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"


dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set("view engine","ejs")
app.set("views","./views")

app.use(express.static("public"))

app.use("/",userRoutes)

export default app 