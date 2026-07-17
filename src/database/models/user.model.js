import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    unique_name: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: function(){
        return this.provider==="system"

      },
    },

    phone: {
      type: String,
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
    },

    profile_image: {
      type: String,
    },

    role: {
      type: Number,
      enum: [0, 1],
      default: 0,
    },

    is_verified: {
      type: Boolean,
      default: false,
    },
    provider:{
        type:String,
        enum:["google","system"],
        default:"system"
    }
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
