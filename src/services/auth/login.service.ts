import { comparePassword } from "../../lib/bcrypt";
import prisma from "../../prisma";
import { IUser } from "../../types/user.type";
import { sign } from "jsonwebtoken";
import { appConfig } from "../../utils/config";

const MAX_LOGIN_ATTEMPTS = 3;
const SUSPENSION_DURATION = 60;

export const loginService = async (body: Pick<IUser, "email" | "password">) => {
  try {
    const { email, password } = body;

    let user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error("invalid email address");
    }

    if (
      user.accountStatus === "Suspended" &&
      user.suspendedUntil &&
      user.suspendedUntil > new Date()
    ) {
      const remainingTime = Math.ceil(
        (user.suspendedUntil.getTime() - new Date().getTime()) / 1000
      );
      throw new Error(
        `account suspended. Please try again in ${remainingTime} seconds`
      );
    }

    if (
      user.accountStatus === "Suspended" &&
      user.suspendedUntil &&
      user.suspendedUntil <= new Date()
    ) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          accountStatus: "Active",
          suspendedUntil: null,
          loginAttempts: 0,
        },
      });
    }

    if (
      user.loginAttempts >= MAX_LOGIN_ATTEMPTS &&
      user.accountStatus !== "Suspended"
    ) {
      const suspendedUntil = new Date();
      suspendedUntil.setSeconds(
        suspendedUntil.getSeconds() + SUSPENSION_DURATION
      );

      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          accountStatus: "Suspended",
          suspendedUntil,
        },
      });

      throw new Error(
        "account suspended due to multiple failed login attempts"
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts: user.loginAttempts + 1 },
      });
      throw new Error("invalid password");
    }

    const token = sign({ id: user.id }, appConfig.jwtSecretKey!, {
      expiresIn: "2h",
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0 },
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
