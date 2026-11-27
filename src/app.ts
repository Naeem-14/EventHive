import express from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth/", authRoutes);

app.use(globalErrorHandler);

export default app;
