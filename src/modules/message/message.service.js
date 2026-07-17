import messageModel from "../../database/models/message.model.js";
import userModel from "../../database/models/user.model.js";
import { NotFoundException } from "../../common/responce/error.responce.js";

export const createMessage = async (data) => {
  const { receiverId, content } = data;
  const user = await userModel.findById(receiverId);
  if (!user) {
    throw NotFoundException({
      message: "receiver not found",
    });
  }
  const message = await messageModel.create({
    receiverId,
    content,
  });
  return message;
};

export const getMessages = async (userId) => {
  const messages = await messageModel
    .find({ receiverId: userId })
    .populate("receiverId", "name email");
  return messages;
};

export const deleteMessage = async (messageId) => {
  const message = await messageModel.findByIdAndDelete(messageId);
  if (!message) {
    throw NotFoundException({
      message: "message not found",
    });
  }
  return message;
};


export const replyMessage = async (messageId, body, userId) => {
  const message = await messageModel.findById(messageId);
  if (!message) {
    throw NotFoundException({
      message: "message not found",
    });
  }
  const reply = await messageModel.create({
    content: body.content,
    senderId: userId,
    receiverId: message.senderId,
    replyTo: message._id,
  });
  return reply;
};
