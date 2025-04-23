    const {User} = require("../models");
    const {Op}=require("sequelize");
    const findUserByEmailOrUsername=async(emailorUsername)=>{
        return await User.findOne({
            where:{
                [Op.or]:[{email:emailorUsername},{username:emailorUsername}]
            }
        })
    }


    const findUserById=async(id)=>{
        return await User.findByPk(id)
    }
    const createUser=async(userData)=>{
        return await User.create(userData)
    }
    module.exports={findUserByEmailOrUsername,findUserById,createUser}