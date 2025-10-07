// config.js
import path from "path";
import os from "os";
import fs from "fs";

const LOG_DIR = path.join(os.homedir(), ".silverhawk-infra") || os.tmpdir(); 

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function getDateString(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function getLogFile(date = new Date()) {
  return path.join(LOG_DIR, `silverhawk-infra-${getDateString(date)}.log`);
}

const BACKEND_URL = "http://localhost:4000/metrics";
const INTERVAL = 5000; // 30 seconds
const HOSTNAME = os.hostname();

const LOG_FILE = getLogFile();
const PID_FILE = path.join(os.tmpdir(), "silverhawk-infra.pid");

export { LOG_DIR, LOG_FILE, PID_FILE, BACKEND_URL, INTERVAL, HOSTNAME, getDateString, getLogFile };
