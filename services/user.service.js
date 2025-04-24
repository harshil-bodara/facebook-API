import User from "../models/user.model.js";

import { Op } from "sequelize";

const findUserByEmailOrUsername = async (emailorUsername) => {
  console.log("emailorUsername", emailorUsername);

  return await User.findOne({
    where: {
      [Op.or]: [{ email: emailorUsername }, { username: emailorUsername }],
    },
  });
};

const findUserById = async (id) => {
  return await User.findByPk(id);
};

const createUser = async (userData) => {
  return await User.create(userData);
};

export { findUserByEmailOrUsername, findUserById, createUser };
