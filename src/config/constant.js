// config.js
import path from "path";
import os from "os";
import fs from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { version } = require("../../package.json");
const LOG_DIR = path.join(os.homedir(), ".silverhawk-infra") || os.tmpdir(); 

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function getDateString(date = new Date()) {
  return date.toISOString().split("T")[0];
}

function getLogFile(date = new Date()) {
  return path.join(LOG_DIR, `silverhawk-infra-${getDateString(date)}.log`);
}

const BACKEND_URL = "http://localhost:5000/v1";
const INTERVAL = 30000; // 30 seconds
const HOSTNAME = os.hostname();

const LOG_FILE = getLogFile();
const PID_FILE = path.join(os.tmpdir(), "silverhawk-infra.pid");
const CONFIG_PATH = path.join(os.homedir(), '.silverhawk-infra', 'config.json');
const VERSION = version

export { LOG_DIR, LOG_FILE, PID_FILE, BACKEND_URL, INTERVAL, HOSTNAME, VERSION, CONFIG_PATH, getDateString, getLogFile };
