import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({ 
    limit: "16kb"
})); //for forms

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
})); //for url params

//limit is set to 16kb to prevent large payloads, which can help mitigate certain types of attacks and reduce server load.

app.use(express.static("public")); //for static files ie serve files from backend/public

app.use(cookieParser()); //for cookies


//routes import 

import userRouter from "./routes/user.routes.js";

//routes declaration

app.use("/api/v1/users", userRouter);

export default app;