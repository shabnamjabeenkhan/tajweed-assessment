# Tajweed Quiz MVP – System Architecture

```mermaid
graph TD
  subgraph Client
    A[Browser / Mobile Web]
    UI[React Router v7 App]
  end

  subgraph Auth
    Clerk[Clerk Auth API]
  end

  subgraph Backend
    Convex[Convex Functions]
    DB[Convex Data Tables]
    Scheduler[Convex Scheduler]
  end

  subgraph Services
    Resend[Resend Email]
    Polar[Polar Billing]
    OpenAI[OpenAI (Optional)]
  end

  subgraph Infra
    Vercel[Vercel Hosting]
    Sentry[Sentry Monitoring]
    Logtail[Logtail Logs]
  end

  A -->|SSR + SPA| UI
  UI -->|Sign-in| Clerk
  UI -->|Loaders/Actions| Vercel
  Vercel -->|Server Render| UI
  Vercel --> Convex
  Convex --> DB
  Convex -->|Auth verification| Clerk
  Convex -->|Optional emails| Resend
  Convex -->|Future billing| Polar
  Convex -->|Future AI tips| OpenAI
  Scheduler --> DB
  Scheduler --> Convex
  Convex --> Sentry
  Convex --> Logtail
  UI --> Sentry
```

