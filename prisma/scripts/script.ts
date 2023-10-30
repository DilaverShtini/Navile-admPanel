import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  /*const models = Object.keys(prisma);
  const filteredModels = models.filter(model => !model.startsWith('_') && !model.startsWith('$'));
  return filteredModels*/
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
