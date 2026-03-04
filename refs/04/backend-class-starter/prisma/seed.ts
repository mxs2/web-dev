import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.createMany({
    data: [
      { name: "Books" },
      { name: "Electronics" },
      { name: "Home" },
    ],
    skipDuplicates: true,
  });

  const catBooks = await prisma.category.findUnique({ where: { name: "Books" } });
  const catElec = await prisma.category.findUnique({ where: { name: "Electronics" } });

  if (!catBooks || !catElec) throw new Error("Seed failed: categories missing");

  await prisma.product.createMany({
    data: [
      { name: "Clean Code", sku: "BOOK-001", priceCents: 12990, categoryId: catBooks.id },
      { name: "Design Patterns", sku: "BOOK-002", priceCents: 15990, categoryId: catBooks.id },
      { name: "USB-C Cable", sku: "ELEC-001", priceCents: 2990, categoryId: catElec.id },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
