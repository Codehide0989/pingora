<p align="center" style="margin-top: 120px">

  <h3 align="center">Pingora</h3>

  <p align="center">
  <a href="https://status.pingora.dev">
    <img src='https://status.pingora.dev/badge/v2?variant=outline'>
  </a>
  </p>

## Cron Jobs

You need to set up a Cron Job to run the scheduled checks. You can use Vercel Cron or any other cron service.
The cron job should call the endpoint `/api/checker/cron` with the header `Authorization: Bearer <CRON_SECRET>`.
You can generate a random secret for `CRON_SECRET` using `openssl rand -base64 32` or similar.

  <p align="center">The Open-Source synthetic monitoring platform.
    <br />
    <a href="https://www.pingora.dev"><strong>Learn more »</strong></a>
    <br />
    <br />
    <a href="https://www.pingora.dev/discord">Discord</a>
    ·
    <a href="https://www.pingora.dev">Website</a>
    ·
    <a href="https://github.com/pingorahq/pingora/issues">Issues</a>
  </p>
</p>

## About Pingora 🏓

Pingora is open-source synthetic monitoring platform.

- **Synthetic monitoring**: Monitor your website and APIs globally and receive
  notifications when they are down or slow.

## Recognitions 🏆

<a href="https://trendshift.io/repositories/1780" target="_blank"><img src="https://trendshift.io/api/badge/repositories/1780" alt="pingoraHQ%2Fpingora | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

<a href="https://news.ycombinator.com/item?id=37740870">
  <img
    alt="Featured on Hacker News"
    src="https://hackerbadge.now.sh/api?id=37740870"
    style="width: 250px; height: 55px;" width="250" height="55"
  />
</a>

## Contact us 💌

If you are interested in our enterprise plan or need special features, please
email us at [ping@pingora.dev](mailto:ping@pingora.dev) or book a
call<br/><br/>
<a href="https://cal.com/team/pingora/30min"><img alt="Book us with Cal.com" src="https://cal.com/book-with-cal-dark.svg" /></a>

## Contributing 🤝

If you want to help us building the best status page and alerting system, you
can check our
[contributing guidelines](https://github.com/pingoraHQ/pingora/blob/main/CONTRIBUTING.MD)

### Top Contributors

<a href="https://github.com/pingorahq/pingora/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=pingorahq/pingora" />
</a>

Made with [Contrib.rocks](https://contrib.rocks)

### Stats

![Alt](https://repobeats.axiom.co/api/embed/180eee159c0128f683a30f15f51ac35bdbd9fa44.svg "Repobeats analytics image")

## Tech stack 🥞

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [tinybird](https://tinybird.co/?ref=pingora.dev)
- [turso](https://turso.tech/)
- [drizzle](https://orm.drizzle.team/)
- [Resend](https://resend.com/)

[![Built with Depot](https://depot.dev/badges/built-with-depot.svg)](https://depot.dev/?utm_source=Opource=Pingora)

## Getting Started 🚀

### With Docker (Recommended)

The fastest way to get started for both development and self-hosting:

```sh
# 1. Copy environment file
cp .env.docker.example .env.docker

# 2. Start all services
docker compose up -d

# 3. Access the application
open http://localhost:3002  # Dashboard
open http://localhost:3003  # Status Pages
```

📖 **Full guide**: [DOCKER.md](DOCKER.md)

### With Devbox

You can use [Devbox](https://www.jetify.com/devbox/) and get started with the following commands:

1. Install Devbox
    ```sh
    curl -fsSL https://get.jetify.com/devbox | bash
    ```
2. Install project dependencies, build and start services
    ```sh
    devbox services up
    ```

### Manual Setup

#### Requirements

- [Node.js](https://nodejs.org/en/) >= 20.0.0
- [pnpm](https://pnpm.io/) >= 8.6.2
- [Bun](https://bun.sh/)
- [Turso CLI](https://docs.turso.tech/quickstart)

#### Setup

1. Clone the repository

```sh
git clone https://github.com/pingorahq/pingora.git
```

2. Install dependencies

```sh
pnpm install
```

3. Initialize the development environment

Launch the database in one terminal:

```sh
turso dev --db-file pingora-dev.db
```

In another terminal, run the following command:

```sh
pnpm dx
```

4. Launch whatever app you wish to:

```sh
pnpm dev:web
pnpm dev:status-page
pnpm dev:dashboard
```

The above commands whill automatically run the libSQL client on `8080` so you might wanna kill the turso command from step 3.

5. See the results:

- open [http://localhost:3000](http://localhost:3000) (default port)

### Videos

Videos to better understand the Pingora codebase:

- [The code behind Pingora and how it uses Turbopack](https://youtube.com/watch?v=PYfSJATE8v8).
- [Drop Betterstack and go open source](https://www.youtube.com/watch?v=PKag0USy3eQ)
