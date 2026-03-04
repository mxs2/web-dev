import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET;

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "E-mail e senha são obrigatórios" });
      }

      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          email: user.email,
          name: user.name
        },
        JWT_SECRET,
        {
          expiresIn: "2h"
        }
      );

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error("Erro no login:", err);
      return res.status(500).json({ message: "Erro ao realizar login" });
    }
  }
};
