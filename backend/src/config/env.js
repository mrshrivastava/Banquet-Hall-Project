import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const environmentFile = resolve(currentDirectory, '../../.env');

dotenv.config({ path: environmentFile });

export function requireEnvironmentVariable(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing. Add it to backend/.env before starting the API.`);
  }

  return value;
}
