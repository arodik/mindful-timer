# Mindful Timer ✨✨✨

`npm i -g mindful-timer`

A simple Pomodoro timer for **macOS only** that:
- Automatically enables Do Not Disturb (Focus) mode during work sessions.
- Displays a system alert instead of a standard notification when the timer finishes.

## Usage

```bash
# Start a timer (default: 25 minutes)
mindful-timer start [duration]

# View logged sessions
mindful-timer log [period]

# View session statistics
mindful-timer stats [period]
```

### Command Arguments

* **`duration`**: Optional duration of the session in minutes (default is `25`).
* **`period`**: Optional time range filter. Supported values: `day`, `week`, `month`, `quarter`, `year`, `full` (default is `week`).

### Options for `start`

* **`-n`, `--name`**: Name or description of the session.
* **`-t`, `--tags`**: List of tags separated by whitespace (e.g. `work js`).

### Usage Example

```bash
mindful-timer start 25 -n 'Coding session' -t 'work javascript'
```

## macOS Shortcuts Integration

This library uses the native macOS Shortcuts app under the hood to manage focus mode. You will be prompted to install the required `macos-focus-mode` shortcut on the first run of the timer.

![image](https://user-images.githubusercontent.com/2021794/155902780-d8e605c8-8ba3-499f-99d2-e5609f28fc1f.png)

## Advanced: Database Location

By default, the database is stored in your home directory:
* **Database path:** `~/.mindful-timer/db.ndjson`
* **Configuration path:** `~/.mindful-timer/config.json`

If you want to use a custom directory (e.g., for cloud sync or backup), you can edit the `config.json` file and specify a custom `dataPath`:
```json
{
    "dataPath": "/Users/username/Library/Mobile Documents/com~apple~CloudDocs/.mindful-timer-data"
}
```
