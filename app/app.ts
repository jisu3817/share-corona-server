import express from "express";
import dotenv from "dotenv";

const app: express.Application = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


import root from "./src/apis/root";

app.use("/api", root);

export default app;