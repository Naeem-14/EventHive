import express from "express";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(globalErrorHandler);

export default app;
