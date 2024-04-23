import { NextFunction, Request, Response } from "express";

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    return {
      data: [],
    };
  } catch (error) {
    next(error);
  }
};
