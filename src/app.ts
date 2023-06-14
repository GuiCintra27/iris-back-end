import "reflect-metadata";
import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { OAuth2Client } from "google-auth-library";

const env = dotenv.config();
dotenvExpand.expand(env);

export const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

import { connectDb, disconnectDB } from "./config";

import {
  usersRouter,
  authenticationRouter,
  newsLetterRouter,
  contactRouter,
  postRouter,
  donateRouter,
  topicsRouter,
  volunteerRouter,
  adminRouter,
} from "./routers";

const app = express();
app
  .use(cors())
  .use(express.json())
  .use(express.static("public"))
  .get("/", (_req, res) => {
    res.sendFile("index.html", { "root": "../public" });
  })
  .get("/health", (req, res) => res.send("OK"))

  .use("/users", usersRouter)
  .use("/admin", adminRouter)
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
