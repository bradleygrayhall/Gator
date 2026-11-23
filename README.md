# gator

`gator` is a command-line RSS feed aggregator written in TypeScript. It lets you register local users, add and follow RSS feeds, collect articles into a PostgreSQL database, and browse the latest posts from feeds you follow.

## Prerequisites

- **Node.js 22.15.0** (the version listed in `.nvmrc`) and **npm**.
- **PostgreSQL**, running locally or on a host you can connect to, with a database that `gator` can access.
- **Git** if you want to clone the repository or contribute.
- Internet access to retrieve RSS feeds.

This repository runs the CLI with `tsx` through npm. It does **not** currently install a system-wide `gator` command.

## Installation

1. Clone the repository and change into its directory:

   ```bash
   git clone <YOUR_PUBLIC_REPOSITORY_HTTPS_URL>
   cd <REPOSITORY_DIRECTORY>
   ```

   If you've already downloaded the source, simply open a terminal in the project directory.

2. If you use `nvm`, select the project's Node.js version:

   ```bash
   nvm install
   nvm use
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a PostgreSQL database. For example, if you have access to the `postgres` role:

   ```bash
   psql -U postgres -c "CREATE DATABASE gator;"
   ```

   You can use an existing database instead. Your database credentials must allow the application to create tables and read/write data.

## Configuration

Create a file named **`.gatorconfig.json` in your home directory**, *not* in the repository.

- Linux/macOS: `~/.gatorconfig.json`
- Windows: `%USERPROFILE%\.gatorconfig.json` (usually `C:\Users\<you>\.gatorconfig.json`)

Example file contents:

```json
{
  "db_url": "postgres://postgres:YOUR_PASSWORD@localhost:5432/gator",
  "current_user_name": ""
}
```

Replace the PostgreSQL username, password, host, port, and database name with your own values. `db_url` is required. Leave `current_user_name` empty initially: `register` and `login` update it automatically.

**Do not commit real credentials or your personal `.gatorconfig.json` to Git.** Keep the configuration in your home directory.

Once the configuration exists, apply the included database migrations from the project root:

```bash
npm run migrate
```

If you change the database schema during development, use `npm run generate` to create migrations before running `npm run migrate` again.

## Running gator

The command format from the repository root is:

```bash
npm run start -- <command> [arguments]
```

For example, create your first user:

```bash
npm run start -- register alice
```

This creates the user and switches the current user to `alice` in `.gatorconfig.json`.

Add and automatically follow an RSS feed:

```bash
npm run start -- addfeed "Hacker News" https://hnrss.org/frontpage
```

Collect posts once immediately and then periodically (until you stop it with **Ctrl+C**):

```bash
npm run start -- agg 1m
```

In another terminal, browse the newest posts from feeds you follow:

```bash
npm run start -- browse 10
```

The aggregator must fetch posts before `browse` can show them. It works through one feed per polling interval, so newly added feeds may take some time to appear.

## Command reference

| Command | Description | Example |
| --- | --- | --- |
| `register <name>` | Create a user and make that user current. | `npm run start -- register alice` |
| `login <name>` | Switch to an existing user. | `npm run start -- login alice` |
| `users` | List registered users, marking the current user. | `npm run start -- users` |
| `addfeed <name> <url>` | Add an RSS feed and automatically follow it as the current user. | `npm run start -- addfeed "Hacker News" https://hnrss.org/frontpage` |
| `feeds` | List all known feeds and their creators. | `npm run start -- feeds` |
| `follow <url>` | Follow an already-registered feed. | `npm run start -- follow https://hnrss.org/frontpage` |
| `following` | List feeds followed by the current user. | `npm run start -- following` |
| `unfollow <url>` | Stop following a feed. | `npm run start -- unfollow https://hnrss.org/frontpage` |
| `agg <duration>` | Continuously fetch RSS posts, starting immediately and repeating at the given interval. | `npm run start -- agg 30s` |
| `browse [limit]` | Display newest stored posts from the feeds you follow (defaults to 2 posts). | `npm run start -- browse 10` |
| `reset` | **Delete all users and associated feeds, follows, and posts** from the database. Use with caution. | `npm run start -- reset` |

The `agg` duration must be **one value and one unit**, such as `500ms`, `30s`, `5m`, or `1h`. Combined forms such as `1h30m` are not supported by the current parser.

Commands that act on personal subscriptions (`addfeed`, `follow`, `following`, `unfollow`, and `browse`) require a current user selected by `register` or `login`.

## Troubleshooting

- **`ENOENT` / cannot find `.gatorconfig.json`:** Make sure the file exists in your home directory, not just the repository.
- **`db_url is required in config file`:** Add a valid `db_url` string to `.gatorconfig.json`.
- **Database connection fails:** Confirm PostgreSQL is running, the database exists, and the connection string and credentials are correct.
- **Database tables do not exist:** Run `npm run migrate` after setting up the database.
- **`User not logged in`:** Run `npm run start -- register <name>` or `npm run start -- login <name>` first.
- **No posts when browsing:** Make sure you've added or followed a feed and run `agg` long enough to fetch it. Not every URL serves RSS content compatible with this parser.

## Development

Source code is in `src/`. Database tables and queries are defined in `src/lib/db/`, RSS parsing lives in `src/lib/rss.ts`, and CLI handlers are in `src/commands/`.

```bash
npm run generate  # Generate Drizzle migrations after schema edits
npm run migrate   # Apply pending migrations
```
