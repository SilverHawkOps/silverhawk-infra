import fs from 'fs';
import path from 'path';

export const saveConfig = (configPath, apiKey, infraId) => {
  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  fs.writeFileSync(configPath, JSON.stringify({ apiKey, infraId }, null, 2));
}