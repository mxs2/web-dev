// Simple seed script for Prisma with initial users and despesas
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Limpando dados existentes...");
  await prisma.despesa.deleteMany();
  await prisma.user.deleteMany();

  console.log("Criando usuários...");
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@despesas.com",
      password: "admin123", // ATENÇÃO: será substituída por hash na aula de autenticação
      role: "admin"
    }
  });

  const joao = await prisma.user.create({
    data: {
      name: "João",
      email: "joao@teste.com",
      password: "123456", // ATENÇÃO: será substituída por hash na aula de autenticação
      role: "user"
    }
  });

  console.log("Criando despesas...");
  await prisma.despesa.createMany({
    data: [
      {
        descricao: "Supermercado",
        valor: 150.5,
        categoria: "Alimentação",
        userId: joao.id
      },
      {
        descricao: "Uber",
        valor: 35.0,
        categoria: "Transporte",
        userId: joao.id
      },
      {
        descricao: "Assinatura Netflix",
        valor: 39.9,
        categoria: "Entretenimento",
        userId: joao.id
      }
    ]
  });

  console.log("Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
