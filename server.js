import app from "./app.js"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"


const PORT = process.env.PORT || 3000;
connectDB()

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})