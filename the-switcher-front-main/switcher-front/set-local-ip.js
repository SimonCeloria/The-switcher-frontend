import fs from 'fs';
import dotenv from 'dotenv';
import ip from 'ip'; // Librería para obtener la IP local

const localIP = ip.address();

const envPath = ".env.dev";
const envConfig = dotenv.parse(fs.readFileSync(envPath));

envConfig["VITE_API_BASE_URL"] = `http://${localIP}:8080/`;
envConfig["VITE_IP"] = localIP;

const updatedEnv = Object.keys(envConfig)
  .map((key) => `${key}=${envConfig[key]}`)
  .join("\n");

fs.writeFileSync(envPath, updatedEnv);

console.log(`Updated .env.dev with local IP: ${localIP}`);
