const express=require("express")
const dotenv=require("dotenv")
const authRouter = require("./routes/authRoutes")
dotenv.config()
const app=express()




app.use(express.json())
app.use('/api/auth',authRouter)

const port=process.env.PORT




app.listen(port,()=>{
    console.log(`server running on http://localhost:${port}`);
    
})