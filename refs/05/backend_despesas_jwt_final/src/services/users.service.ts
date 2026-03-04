import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role?: string;
};

export const UsersService = {
  async list() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: "desc" }
    });
  },

  async create(input: CreateUserInput) {
    const { name, email, password, role } = input;

    if (!name || !email || !password) {
      throw new Error("Nome, e-mail e senha são obrigatórios");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    return prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: role ?? "user"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
  }
};
