import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const ensureDir = async () => {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

const ensureFile = async (filePath) => {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify([]));
  }
};

export const readData = async (collection) => {
  await ensureDir();
  const filePath = getFilePath(collection);
  await ensureFile(filePath);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

export const writeData = async (collection, data) => {
  await ensureDir();
  const filePath = getFilePath(collection);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};
