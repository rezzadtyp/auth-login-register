import express, { NextFunction, Request, Response, json } from "express";
import authRouter from "./routers/auth.router";
import blogRouter from "./routers/blog.router";

const app = express();

// configure
app.use(json());

// routers
app.use("/auth", authRouter);
app.use("/blogs", blogRouter);

// error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400).send(err.message);
});

export default app;
