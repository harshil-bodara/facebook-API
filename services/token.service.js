const jwt=require("jsonwebtoken")
const generateToken=(payload,expiresIn="1d")=>{
    return jwt.sign(payload,process.env.JWT_SECRET,{expiresIn})
}
const varifyToken=(token)=>{
    console.log("varify tokein in",token);
    
    return jwt.verify(token,process.env.JWT_SECRET)
}
module.exports={generateToken,varifyToken}