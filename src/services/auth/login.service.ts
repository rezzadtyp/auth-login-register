import { comparePassword } from "../../lib/bcrypt";
import prisma from "../../prisma";
import { IUser } from "../../types/user.type";
import { sign } from "jsonwebtoken";
import { appConfig } from "../../utils/config";

export const loginService = async (body: Pick<IUser, "email" | "password">) => {
  try {
    const { email, password } = body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error("invalid email address");
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("invalid password");
    }

    const token = sign({ id: user.id }, appConfig.jwtSecretKey!, {
      expiresIn: "2h",
    });

    return {
      message: "login success",
      data: user,
      token,
    };
  } catch (error) {
    throw error;
  }
};
