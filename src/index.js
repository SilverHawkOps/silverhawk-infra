#!/usr/bin/env node

import si from "systeminformation";
import axios from "axios";
import os from "os";
import dotenv from "dotenv";
import chalk from "chalk";
import fs from "fs";
// import { safeAppendLog } from "./utils/logger";

dotenv.config(); // for endpoint URL, API key, interval, etc.

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];
  return null;
}

function getDateString(date = new Date()) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}
const API_KEY = getArgValue("--api-key");
if (!API_KEY) {
  console.error(chalk.red("Error: --api-key is required"));
  process.exit(1);
}

const BACKEND_URL = "http://localhost:4000/metrics";
const INTERVAL = 5000; // 30 seconds
const LOG_FILE = `silverhawk-infra-${getDateString()}.log` || null;
const HOSTNAME = os.hostname();

async function collectMetrics() {
  const cpu = await si.cpu();
  const load = await si.currentLoad();
  const mem = await si.mem();
  const disk = await si.fsSize();
  const network = await si.networkStats();

  return {
    timestamp: new Date().toISOString(),
    hostname: HOSTNAME,
    cpu: {
      cores: cpu.cores,
      speed: cpu.speed,
      load: load.currentLoad.toFixed(2), // overall load
      perCore: load.cpus.map((c) => ({
        load: c.load.toFixed(2),
        loadUser: c.loadUser.toFixed(2),
        loadSystem: c.loadSystem.toFixed(2),
        loadIdle: c.loadIdle.toFixed(2),
      })),
    },
    memory: {
      totalGB: (mem.total / 1024 ** 3).toFixed(2),
      usedGB: (mem.used / 1024 ** 3).toFixed(2),
    },
    disk: disk
      .filter((d) => d.mount === "/" || d.mount.startsWith("/home"))
      .map((d) => ({
        mount: d.mount,
        sizeGB: (d.size / 1024 ** 3).toFixed(2),
        usedGB: (d.used / 1024 ** 3).toFixed(2),
      })),
    network: network.map((n) => ({
      iface: n.iface,
      rx_bytes: n.rx_bytes,
      tx_bytes: n.tx_bytes,
    })),
  };
}

async function sendMetrics(metrics) {
  try {
    await axios.post(BACKEND_URL, metrics, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `ApiKey ${API_KEY}`,
      },
    });
  } catch (err) {}
}

async function runAgent() {
  while (true) {
    const metrics = await collectMetrics();
    if (LOG_FILE) {
      fs.appendFileSync(LOG_FILE, JSON.stringify(metrics) + "\n");

      //  safeAppendLog(JSON.stringify(metrics) + "\n"  );
    }
    // await sendMetrics(metrics);
    await new Promise((res) => setTimeout(res, INTERVAL));
  }
}

runAgent();
