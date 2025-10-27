# SilverHawk Infra CLI (silverhawk-infra)

SilverHawk Infra is a lightweight CLI tool for monitoring your infrastructure. It collects metrics from servers, VMs, and containers, sending them to your SilverHawk dashboard in real-time.

## Features

- Monitor CPU, memory, disk, and network usage

- Track running processes and their resource consumption

- Works on Linux, Windows, and container environments

- CLI-based agent for easy installation and control

- Configurable metric collection intervals

- Integrates with SilverHawk dashboards and alerting

## Installation

Install globally via NPM:

```bash
npm install -g silverhawk-infra
```


Verify installation:

```bash
silverhawk-infra --version
```

## CLI Commands
| Command                          | Description                                   |
|----------------------------------|-----------------------------------------------|
| `silverhawk-infra heartbeat --api-key YOUR_API_KEY`          | Sends the heartbeat to silverhawk apm dashboard                    |
| `silverhawk-infra start --api-key YOUR_API_KEY`           | Start the agent                                |
| `silverhawk-infra stop`         | Stop the agent                     |
| `silverhawk-infra logs`         | Show agent logs                     |

## Usage Example

Start monitoring:

```bash
silverhawk-infra start
```

Heartbeat monitoring:

```bash
silverhawk-infra heartbeat --api-key YOUR_API_KEY
```

Note: Replace YOUR_API_KEY with your actual SilverHawk API key. SilverHawk API key can be found in your SilverHawk dashboard under infrastructure list.

Check status:

```bash
silverhawk-infra status
```

Stop monitoring:

```bash
silverhawk-infra stop
```

Show logs:

```bash
silverhawk-infra logs
```

## License

MIT License © 2025 SilverHawk Team