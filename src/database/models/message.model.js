import mongoose, { Schema, model, Types } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },

    senderId: {
      type: Types.ObjectId,
      ref: "User",
      default: null,
    },

    receiverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    replyTo: {
      type: Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const messageModel = mongoose.models.Message || model("Message", messageSchema);

export default messageModel;
