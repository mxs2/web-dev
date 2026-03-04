
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SECTORS = ["Varejo", "Atacado", "E-commerce", "Corporativo"];
const CATEGORIES = ["Plantas", "Natal", "Páscoa", "Verão", "Promoção"];

async function main() {
  console.log("Limpando tabela...");
  await prisma.sale.deleteMany();

  const total = 100000;
  const now = new Date();
  const data: { date: Date; sector: string; category: string; amount: number }[] = [];

  for (let i = 0; i < total; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    data.push({
      date: d,
      sector: SECTORS[Math.floor(Math.random() * SECTORS.length)],
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
      amount: parseFloat((Math.random() * 1000).toFixed(2)),
    });
  }

  console.log("Inserindo registros...");
  const chunkSize = 2000;
  for (let i = 0; i < data.length; i += chunkSize) {
    const chunk = data.slice(i, i + chunkSize);
    await prisma.sale.createMany({ data: chunk });
    console.log(`Inseridos ${Math.min(i + chunkSize, data.length)} de ${total}`);
  }

  console.log("Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
