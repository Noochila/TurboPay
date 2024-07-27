import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcrypt'

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'm@t.com' },
    update: {},
    create: {
      number: '9148729467',
      password: await bcrypt.hash('123456', 10),
      name: 'manoj',
      email: 'm@t.com',
      Balance: {
        create: {
            amount: 2000,
            locked: 0
        }
      },
      
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Success",
          amount: 20000,
          token: "122",
          provider: "HDFC Bank",
        },
      },
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'm2@t.com' },
    update: {},
    create: {
      number: '8277303167',
      password: await bcrypt.hash('123456', 10),
      name: 'Mohan',
      email: 'm2@t.com',
      Balance: {
        create: {
            amount: 2000,
            locked: 0
        }
      },
      OnRampTransaction: {
        create: {
          startTime: new Date(),
          status: "Failure",
          amount: 2000,
          token: "123",
          provider: "HDFC Bank",
        },
      },
    },
  })
  console.log({ alice, bob })
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