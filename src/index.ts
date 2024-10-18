import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { base_url_client } from "../prisma/lib/utils";

const app = express();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})

app.use(cors({
    origin: base_url_client,
    credentials:true,
}));

app.use(express.json());
app.use(cookieParser())
