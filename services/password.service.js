const bcrypt=require("bcrypt")
const hashPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10);
    return await bcrypt.hash(password,salt)
}
const comparePassword=async(password,hashedPassword)=>{
    console.log("password",password);
    
    return await bcrypt.compare(password,hashedPassword)
}

module.exports={hashPassword,comparePassword}

