import { Router } from "express";
import { getData, updateData } from "./user.service.js";
import { SuccessResponse } from "../../common/responce/success.responce.js";
import { auth } from "../../common/middleware/auth/auth.js";
import { upload } from "../../common/multer/multer.js";

const router = Router();

router.get("/profile", auth(), async (req, res) => {
  let user = await getData(req.user.id);
  SuccessResponse({ res, message: "Your Data", data: user });
});
router.put("/UpDateUserProfile", auth(), upload().any(), async (req, res) => {
  console.log(req.file);
  let user = await updateData(req.user.id, req.body, req.files);
  SuccessResponse({ res, message: "Your Data Updated", data: user });
});

export default router;
