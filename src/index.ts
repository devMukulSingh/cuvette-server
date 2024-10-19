import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { base_url_client } from "./lib/utils";
import authRouter from "./routes/authRouter";
import userRouter from "./routes/userRoutes";

const app = express();

const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: base_url_client,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use(`/api/v1/auth`, authRouter);
app.use(`/api/v1/user`, userRouter);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
