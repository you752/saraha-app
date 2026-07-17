import { Router } from "express";
import { SuccessResponse } from "../../common/responce/success.responce.js";
import { validate } from "../../common/vaildation/vaildation.js";
import {
  createMessage,
  getMessages,
  deleteMessage,
  replyMessage,
} from "./message.service.js";
import { newMessage, replySchema } from "./message.validation.js";
import { auth } from "../../common/middleware/auth/auth.js";

const router = Router();

router.post("/send-message", validate(newMessage), async (req, res) => {
  const result = await createMessage(req.body);

  SuccessResponse({
    res,
    message: "message sent successfully",
    data: result,
  });
});

router.get("/getmessage", auth(), async (req, res) => {
  const result = await getMessages(req.user._id);
  SuccessResponse({
    res,
    data: result,
  });
});

router.delete("/deletemessage/:id", auth(), async (req, res) => {
  const result = await deleteMessage(req.params.id);
  SuccessResponse({
    res,
    message: "message deleted successfully",
    data: result,
  });
});

router.post("/reply/:id", auth(), validate(replySchema), async (req, res) => {
  const result = await replyMessage(req.params.id, req.body, req.user._id);
  SuccessResponse({
    res,
    message: "Reply sent successfully",
    data: result,
  });
});

export default router;
