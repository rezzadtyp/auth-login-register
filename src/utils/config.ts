import dotenv from "dotenv";

dotenv.config();

export const appConfig = {
  port: process.env.PORT,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
};
