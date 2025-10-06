#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { Command } from 'commander';

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const program = new Command();
const agentPath = path.resolve('./src/index.js');
const pidFile = path.join(os.tmpdir(), 'silverhawk-infra.pid');

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function startAgent({apiKey}) {
  if (!apiKey) {
    console.error('Error: --api-key is required to start the agent.');
    process.exit(1);
  }

  if (fs.existsSync(pidFile)) {
    const existingPid = Number(fs.readFileSync(pidFile, 'utf-8'));
    if (isProcessRunning(existingPid)) {
      console.log(`Infra agent is already running (PID: ${existingPid}).`);
      return;
    } else {
      fs.unlinkSync(pidFile);
    }
  }

  const out = fs.openSync(path.join(os.tmpdir(), 'infra-agent.out.log'), 'a');
  const err = fs.openSync(path.join(os.tmpdir(), 'infra-agent.err.log'), 'a');

  const childArgs = [agentPath, '--api-key', apiKey];

  const child = spawn(process.execPath, childArgs, {
    detached: true,
    stdio: ['ignore', out, err],
  });

  child.unref();
  fs.writeFileSync(pidFile, String(child.pid));

  console.log(`SilverHawk Infra agent started`);
}

function stopAgent() {
  if (!fs.existsSync(pidFile)) {
    console.log('SilverHawk Infra agent is not running.');
    return;
  }

  const pid = Number(fs.readFileSync(pidFile, 'utf-8'));
  try {
    process.kill(pid);
    fs.unlinkSync(pidFile);
    console.log(`SilverHawk Infra agent stopped.`);
  } catch (err) {
    console.error('Failed to stop SilverHawk Infra agent:', err.message);
  }
}

// Configure Commander
program
  .name('silverhawk-infra')
  .description('CLI to manage SilverHawk Infra Agent')
  .version(version);

program
  .command('start')
  .description('Start the SilverHawk infra agent')
  .requiredOption('--api-key <key>', 'API key for the agent')
  .action((options) => {
    startAgent({apiKey: options.apiKey});
  });

program
  .command('stop')
  .description('Stop the SilverHawk infra agent')
  .action(() => {
    stopAgent();
  });

program.parse(process.argv);
