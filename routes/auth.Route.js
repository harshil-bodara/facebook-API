const express=require("express")
const { login, signup } = require("../controllers/auth.Controller")
const authMiddleware = require("../middleware/auth")
const upload = require("../middleware/upload")
const { updateProfile } = require("../controllers/userProfile.controller")
const validate = require("../middleware/validate")
const { signupSchema, loginSchema, updateProfileSchema } = require("../validations/auth.validation")
const authRouter=express.Router()


authRouter.post("/signup",validate(signupSchema),signup)
authRouter.post("/login",validate(loginSchema),login)
authRouter.put("/update-profile",authMiddleware,validate(updateProfileSchema),upload.single("profile"),updateProfile)


module.exports=authRouter
