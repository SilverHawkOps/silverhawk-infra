#!/usr/bin/env node

import path from "path";
import { Command } from "commander";
import { createRequire } from "module";
import { startAgent, stopAgent, showLogs, heartbeat } from "./manager.js";

const require = createRequire(import.meta.url);
const { version } = require("../../package.json");
const program = new Command();
const agentPath = path.resolve("./src/agent/agent.js");

program
  .name("silverhawk-infra")
  .description("CLI to manage SilverHawk Infra Agent")
  .version(version);

program
  .command("start")
  .requiredOption("--api-key <key>", "API key")
  .description("Start the agent")
  .action((opts) => startAgent({ apiKey: opts.apiKey, agentPath }));

program.command("stop").description("Stop the agent").action(stopAgent);

program
  .command("heartbeat")
  .requiredOption("--api-key <key>", "API key for agent")
  .description("Send a heartbeat to the dashboard to indicate agent is alive")
  .action(async (opts) => {
    await heartbeat({ apiKey: opts.apiKey });
  });

program
  .command("logs")
  .option("--lines <n>", "Number of lines to show", "10")
  .option(
    "--date <YYYY-MM-DD>",
    "Show logs for specific date, example: 2022-01-01"
  )
  .description("Show agent logs")
  .action((opts) =>
    showLogs({ lines: parseInt(opts.lines, 10), date: opts.date })
  );

program.parse(process.argv);
