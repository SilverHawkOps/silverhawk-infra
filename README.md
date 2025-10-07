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
| `silverhawk-infra start`          | Start the monitoring agent                    |
| `silverhawk-infra stop`           | Stop the agent                                |
| `silverhawk-infra status`         | Show current agent status                     |
| `silverhawk-infra configure`      | Setup or edit agent configuration            |
| `silverhawk-infra collect-now`    | Trigger an immediate metric collection       |


## Configuration

The CLI uses a configuration file ~/.silverhawk-infra/config.json:

```json
{
  "agentName": "silverhawk-infra",
  "interval": "10s",
  "serverUrl": "https://dashboard.silverhawk.com",
  "apiKey": "YOUR_API_KEY",
  "metrics": {
    "cpu": true,
    "memory": true,
    "disk": true,
    "network": true,
    "processes": true
  }
}
```

You can update it via CLI:

```bash
silverhawk-infra configure
```

## Usage Example

Start monitoring:

```bash
silverhawk-infra start
```


Check status:

```bash
silverhawk-infra status
```

Stop monitoring:

```bash
silverhawk-infra stop
```

Force a metric collection:

```bash
silverhawk-infra collect-now
```

## Contributing

Fork the repository

Clone your fork:

```bash
git clone https://github.com/your-org/silverhawk-infra.git
```

Install dependencies:

```bash
npm install
```

Make changes, commit, and push.

```bash
git add .
git commit -m "Your commit message"
git push origin your-branch-name
```

Open a Pull Request.

## Future Scopes - 

1. Get Running processes on user's server (check ps-list package);

## License

MIT License © 2025 SilverHawk Team