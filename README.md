This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Containerization & Deployment

The project includes a production-ready `Dockerfile` and infrastructure scaffolding under `ops/`.

### Docker

Build and run the application in a container:

```bash
docker build -t nextjs-app .
docker run -p 3000:3000 --env DATABASE_URL=postgres://user:password@host/db nextjs-app
```

### Docker Compose

For local development with PostgreSQL:

```bash
docker compose -f ops/compose/dev.yml up --build
```

### Helm

Deploy to Kubernetes using the provided Helm chart:

```bash
helm install nextjs-app ops/helm/nextjs-app \
  --set image.repository=your-registry/nextjs-app \
  --set image.tag=latest
```

## API Documentation

An OpenAPI specification for all server routes is available at `docs/api/openapi.yaml`.

## Security

The application sends common HTTP security headers on every response, including a Content Security Policy, Referrer Policy, and HSTS. Session cookies are marked `HttpOnly`, `Secure` in production, and use `SameSite=Strict` to mitigate cross‑site request forgery.

## Configuration

The application requires a PostgreSQL connection provided via the `DATABASE_URL` environment variable.
Create a `.env` file in the project root using `.env.example` as a starting point:

```env
DATABASE_URL=postgres://user:password@host/db

# Optional: used by `npm run init-db` to create the first admin
INITIAL_ADMIN_USER=admin
INITIAL_ADMIN_PASSWORD=changeme
```

Run `npm run init-db` once to create the necessary tables and optionally seed the first admin user.


## Password reset flow

Visit `/reset` and enter a username. Selecting **Send Code** generates a one‑time code on the server and displays it for demonstration purposes. After receiving the code, enter it together with a new password to complete the reset.

## Demo login system

For a self-contained demonstration that does not rely on the backend APIs, visit `/login-system`. This page showcases a simple login, password reset and dashboard flow implemented entirely on the client side.
