import userModel from "../../database/models/user.model.js";
import {
  ConflictException,
  NotFoundException,
} from "../../common/responce/error.responce.js";
import {
  hashWord,
  compareWord,
} from "../../common/middleware/security/HashWord.js";
import { EncryptWord } from "../../common/middleware/security/phoneCrypto.js";
import { getEnv } from "../../../config/env.service.js";

export const getData = async (user_id) => {
  const userData = await userModel.findById(user_id);

  if (!userData) {
    throw NotFoundException({
      message: "User not found",
    });
  }

  return userData;
};

export const updateData = async (user_id, data, files) => {
  const { password, newPassword, phone, name, unique_name } = data;

  const userData = await userModel.findById(user_id);

  if (!userData) {
    throw NotFoundException({
      message: "User not found",
    });
  }

  const updatedFields = {};

  if (name) {
    updatedFields.name = name;
  }

  if (unique_name) {
    const uniqueNameExist = await userModel.findOne({
      unique_name,
      _id: { $ne: user_id },
    });

    if (uniqueNameExist) {
      throw ConflictException({
        message: "Unique name already taken",
      });
    }

    updatedFields.unique_name = unique_name;
  }

  if (phone) {
    updatedFields.phone = await EncryptWord(phone);
  }

  if (password && newPassword) {
    const isMatch = await compareWord(password, userData.password);

    if (!isMatch) {
      throw ConflictException({
        message: "Current password is incorrect",
      });
    }

    updatedFields.password = await hashWord(newPassword);
  }

  if (files?.length) {
    updatedFields.profile_image = `${getEnv("SERVER_URL")}/${files[0].path.replace(/\\/g, "/")}`;
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    user_id,
    updatedFields,
    {
      new: true,
      runValidators: true,
    },
  );

  return updatedUser;
};
