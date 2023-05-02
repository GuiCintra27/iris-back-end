import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

const env = dotenv.config();
dotenvExpand.expand(env);

import { connectDb, disconnectDB } from "./config";

import {
  usersRouter,
  authenticationRouter,
  newsLetterRouter,
  contactRouter,
  postRouter,
  donateRouter,
  topicsRouter,
} from "./routers";
import { volunteerRouter } from "./routers/volunteer-router";

const app = express();
app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => res.send("OK!"))
  .use("/users", usersRouter)
  .use("/auth", authenticationRouter)
  .use("/news-letter", newsLetterRouter)
  .use("/contact", contactRouter)
  .use("/posts", postRouter)
  .use("/donate", donateRouter)
  .use("/volunteer", volunteerRouter)
  .use("/topics", topicsRouter);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
