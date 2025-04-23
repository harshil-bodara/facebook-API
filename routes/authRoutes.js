const express=require("express")
const { login, signup, updateProfile } = require("../controllers/authCongtroller/authCongtroller")
const authMiddleware = require("../middleware/authMiddleware/authMiddleware")
const upload = require("../middleware/multerMiddleware/multerMiddleware")
const authRouter=express.Router()


authRouter.post("/signup",signup)
authRouter.post("/login",login)
authRouter.put("/update-profile",authMiddleware,upload.single("profile"),updateProfile)


module.exports=authRouter
