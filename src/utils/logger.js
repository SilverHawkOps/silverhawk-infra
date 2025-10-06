import fs from "fs";
import path from "path";

const BASE_NAME = "silverhawk-infra";
const RETENTION_MS = 24 * 60 * 60 * 1000; // 1 day

// Determine current log file (AM or PM)
function getCurrentLogFile() {
  const now = new Date();
  const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const half = now.getHours() < 12 ? "AM" : "PM";
  return path.join(`${BASE_NAME}-${date}-${half}.log`);
}

// Cleanup old logs of the same half-day, keep last half-day logs
function cleanupOldLogs() {
  const files = fs.readdirSync(LOG_DIR);
  const now = Date.now();

  const currentFile = getCurrentLogFile();

  for (const file of files) {
    if (!file.startsWith(BASE_NAME) || !file.endsWith(".log")) continue;

    const filePath = path.join(LOG_DIR, file);
    if (filePath === currentFile) continue; // keep current half

    const stats = fs.statSync(filePath);
    const age = now - stats.mtimeMs;

    if (age > RETENTION_MS) {
      fs.unlinkSync(filePath);
      console.log(`🧹 Deleted old log file: ${file}`);
    }
  }
}

// Append log safely
export function safeAppendLog(data) {
  try {
    const LOG_FILE = getCurrentLogFile();
    cleanupOldLogs();
    fs.appendFileSync(LOG_FILE, data + "\n");
  } catch (err) {
    console.error("Failed to write log:", err.message);
  }
}