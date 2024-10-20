import { Router } from "express";
import {
  getJobsController,
  postJobController,
} from "../controller/userController";
import isAuthenticated from "../middleware/auth";

const userRouter = Router();

userRouter.use(isAuthenticated);

userRouter.post(`/post-job`, postJobController);
userRouter.get(`/get-jobs`, getJobsController);

export default userRouter;
