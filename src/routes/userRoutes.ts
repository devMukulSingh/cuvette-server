import { Router } from "express";
import { postJobController } from "../controller/userController";
import isAuthenticated from "../middleware/auth";


const userRouter = Router();

userRouter.use(isAuthenticated)

userRouter.post(`/post-job`,postJobController)


export default userRouter;