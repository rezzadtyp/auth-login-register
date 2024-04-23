import { IUser } from "../../types/user.type";
import prisma from "../../prisma";
import { hashPassword } from "../../lib/bcrypt";

// Omit -> mengecualikan
// Pick -> pilih type yg mau di extends
interface IRegisterArgs extends Omit<IUser, "id"> {}

export const registerService = async (body: IRegisterArgs) => {
  try {
    const { email, password } = body;
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new Error("email already exist")
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { ...body, password: hashedPassword},
    })

    return {
      message: "register success",
      data: body,
    };
  } catch (error) {
    throw error;
  }
};
