import express from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.routes";
import { eventRoutes } from "./modules/event/event.routes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// const corsOptions = {
//   origin: "http://localhost:5173/",
//   optionsSuccessStatus: 200,
// };

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(cors(corsOptions));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", eventRoutes);

app.use(globalErrorHandler);

export default app;
