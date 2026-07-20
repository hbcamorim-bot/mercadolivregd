import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const utilities = [
  { code: "CEMIG-D", name: "Cemig Distribuição" },
  { code: "CPFL-PAULISTA", name: "CPFL Paulista" },
  { code: "ENEL-SP", name: "Enel Distribuição São Paulo" },
  { code: "NEOENERGIA-COELBA", name: "Neoenergia Coelba" },
  { code: "EQUATORIAL-GO", name: "Equatorial Goiás" },
]

async function main() {
  for (const utility of utilities) {
    await prisma.distributionUtility.upsert({
      where: { code: utility.code },
      update: { name: utility.name, active: true },
      create: utility,
    })
  }
}

main()
  .catch((error) => {
    console.error("Falha ao carregar dados de referência.", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
