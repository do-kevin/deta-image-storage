import express from 'express';
import bodyParser = require('body-parser');
import { config } from 'dotenv';
import cors from 'cors';
import { PrismaClient } from '../../../node_modules/.prisma/client/index.js';
import { DetaDrive } from '../../../libs/shared/services/deta-drive';
import multer from 'multer';
import CryptoJS from 'crypto-js';

if (process.env.NODE_ENV !== 'production') {
  config({ path: '.envrc' });
}

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const secretKey = process.env.VITE_SECRET_KEY || null;

const app = express();

app.use(cors());

// application/json parser
app.use(express.json());

// application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({
  extended: true,
  limit: '200mb',
  parameterLimit: 1000000,
});
app.use(urlencodedParser);

const prisma = new PrismaClient();

async function main() {
  return null;
}

main()
  .then()
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.post('/api/upload', multer().single('filefield'), async (req, res) => {
  if (!secretKey) {
    return res.sendStatus(401).send('Missing secret key.');
  }

  try {
    const { file, body } = req;
    const { name, type, project_key, drive_name } = body;

    let fileName = name;
    const decryption = CryptoJS.AES.decrypt(project_key, secretKey);
    const decryptedProjectKey = decryption.toString(CryptoJS.enc.Utf8);

    const deta = new DetaDrive(decryptedProjectKey, drive_name);

    deta.createDrive(drive_name);

    if (RegExp(/^.*\.(jpg|JPG|gif|GIF|png|PNG)$/gm).test(name)) {
      const newExtension = name
        .slice(name.length - 4, name.length)
        .toLowerCase();

      fileName = fileName.slice(0, -4) + newExtension;
    }

    const result = await deta.uploadImage(file, {
      name: fileName,
      type,
    });

    res.send(result);
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`[ ready ] http://localhost:${port}`);
});
