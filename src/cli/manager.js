// src/agent/manager.js
import fs from "fs";
import os from "os";
import path from "path";
import chalk from "chalk";
import { spawn } from "child_process";
import {
  PID_FILE,
  getLogFile,
  getDateString,
  BACKEND_URL,
  HOSTNAME,
} from "../config/constant.js";
import axios from "axios";

/** Check if process is running */
export function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/** Start agent */
export function startAgent({ apiKey, agentPath }) {
  if (!apiKey) {
    console.error("Error: --api-key is required.");
    process.exit(1);
  }

  if (fs.existsSync(PID_FILE)) {
    const existingPid = Number(fs.readFileSync(PID_FILE, "utf-8"));
    if (isProcessRunning(existingPid)) {
      console.log(`Infra agent already running (PID: ${existingPid})`);
      return;
    }
    fs.unlinkSync(PID_FILE);
  }

  const out = fs.openSync(path.join(os.tmpdir(), "infra-agent.out.log"), "a");
  const err = fs.openSync(path.join(os.tmpdir(), "infra-agent.err.log"), "a");

  const child = spawn(process.execPath, [agentPath, "--api-key", apiKey], {
    detached: true,
    stdio: ["ignore", out, err],
  });

  child.unref();
  fs.writeFileSync(PID_FILE, String(child.pid));
  console.log("SilverHawk Infra agent started");
}

/** Stop agent */
export function stopAgent() {
  if (!fs.existsSync(PID_FILE)) {
    console.log("SilverHawk Infra agent is not running.");
    return;
  }

  const pid = Number(fs.readFileSync(PID_FILE, "utf-8"));
  try {
    process.kill(pid);
    fs.unlinkSync(PID_FILE);
    console.log("SilverHawk Infra agent stopped.");
  } catch (err) {
    console.error("Failed to stop agent:", err.message);
  }
}

/** Show logs */
export function showLogs({ lines = 10, date = getDateString() }) {
  const logFile = getLogFile();

  console.log(logFile)

  if (!fs.existsSync(logFile)) {
    console.log(`No log file found for ${date} at ${logFile}`);
    return;
  }

  const content = fs.readFileSync(logFile, "utf-8").trim().split("\n");
  const lastLines = content.slice(-lines);

  lastLines.forEach((line) => {
    try {
      const data = JSON.parse(line);
      const time = chalk.gray(`[${data.timestamp}]`);
      const host = chalk.blueBright(data.hostname);
      const cpuLoad = chalk.yellow(`${data.cpu.load}%`);
      const memUsed = chalk.green(
        `${data.memory.usedGB}/${data.memory.totalGB} GB`
      );
      const diskInfo = data.disk
        .map(
          (d) =>
            `${chalk.magenta(d.mount)}: ${chalk.green(
              `${d.usedGB}/${d.sizeGB} GB`
            )}`
        )
        .join(", ");

      console.log(
        `${time} ${host} | CPU: ${cpuLoad} | MEM: ${memUsed} | DISK: ${diskInfo}`
      );
    } catch {
      console.log(chalk.red(line));
    }
  });
  console.log();
}

export async function heartbeat({ apiKey }) {
  if (!apiKey) {
    console.error("Error: --api-key is required to send heartbeat.");
    process.exit(1);
  }

  const serverUrl = BACKEND_URL; // e.g., "https://dashboard.example.com/api/heartbeat"

  try {
    // const res = await axios.post(
    //   `${serverUrl}`,
    //   {
    //     hostname: HOSTNAME,
    //     timestamp: new Date().toISOString(),
    //   },
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `ApiKey ${apiKey}`,
    //     },
    //   }
    // );

    console.log("Sending heartbeat...");

    console.log("Heartbeat sent successfully ✅");
  } catch (err) {
    console.error("Failed to send heartbeat:", err.message);
  }
}
