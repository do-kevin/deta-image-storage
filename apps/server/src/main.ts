import express from 'express';
import { config } from 'dotenv';
import { PrismaClient } from '../../../node_modules/.prisma/client/index.js';

if (process.env.NODE_ENV !== 'production') {
  config({
    path: '.envrc',
  });
}

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

const prisma = new PrismaClient();

async function main() {
  // await prisma.user.create({
  //   data: {
  //     email: 'user@example.com',
  //     name: 'Alex Doe',
  //     type: 'administrator',
  //     password: 'password123',
  //     apiKey: null,
  //   },
  // });
  // const allUsers = await prisma.user.findMany({
  //   include: {
  //     images: true,
  //   },
  // });
  // console.log('users: ', allUsers);
}

main()
  .then()
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  });

app.get('/', (req, res) => {
  console.log('env vars: ', process.env);
  res.send({ message: 'Hello API' });
});

app.listen(port, () => {
  console.log(`[ ready ] http://localhost:${port}`);
});
