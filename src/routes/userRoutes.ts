import { Router } from "express";
import {
  getJobsController,
  postJobController,
  sendMailsController,
} from "../controller/userController";
import isAuthenticated from "../middleware/auth";

const userRouter = Router();

userRouter.use(isAuthenticated);

userRouter.post(`/post-job`, postJobController);
userRouter.get(`/get-jobs`, getJobsController);
userRouter.post(`/send-mails`, sendMailsController);


export default userRouter;
