# 📚 Kaizen Setup Guides

This directory contains comprehensive setup guides for configuring and deploying your Kaizen application.

## 🚀 Getting Started

1. **[Configuration Guide](./configuration.md)** - Start here to understand the flexible configuration system
2. **[Running Locally](./running-locally.md)** - Set up your development environment
3. **[Deploy to Railway](./deploy-railway.md)** - Deploy your app (recommended)

## 📋 Service-Specific Guides

### Core Features
- **[Email Setup (Resend)](./email-setup.md)** - Configure transactional emails with Resend via Convex component

### Deployment & Migration
- **[Migrate from Vercel to Railway](./migrate-vercel-to-railway.md)** - Step-by-step guide for migrating from Vercel to Railway

### Monitoring & Observability
- **[Monitoring Setup](./monitoring-setup.md)** - Set up error reporting (Sentry) and uptime monitoring (OpenStatus)


## 🔧 Configuration Quick Reference

The Kaizen boilerplate supports these feature combinations:

| Feature | Service | Purpose |
|---------|---------|---------|
| **Authentication** | Clerk | User login/signup, protected routes |
| **Payments** | Polar.sh | Subscription billing, payment processing |
| **Backend** | Convex | Real-time database, server functions |
| **Email** | Resend | Transactional emails via Convex component |
| **Monitoring** | Sentry + OpenStatus | Error reporting, uptime monitoring |

## 📖 Guide Overview

### [Configuration Guide](./configuration.md)
**What it covers:**
- Feature flag system explanation
- Pre-built configuration examples (SaaS, frontend-only, auth-only, etc.)
- Environment variable setup
- UI configuration options

**When to use:** Always start here to understand how the configuration system works.

### [Running Locally](./running-locally.md)
**What it covers:**
- Step-by-step local development setup
- Environment variable configuration for each feature
- Starting development servers
- Testing your local setup

**When to use:** Setting up your development environment for the first time.

### [Deploy to Railway](./deploy-railway.md)
**What it covers:**
- Railway deployment with GitHub integration
- Automatic deployments on every push
- PR preview environments for teams
- Environment variable setup for production
- Webhook configuration
- Custom domain setup
- Production testing checklist

**When to use:** When you're ready to deploy your app to production (recommended for teams and most users).

### [Self-Hosting on VPS](./self-hosting.md)
**What it covers:**
- Docker deployment on your own server
- nginx reverse proxy setup
- SSL certificate configuration with Let's Encrypt
- Docker Compose for production
- Monitoring and maintenance
- Cost comparison: VPS vs Railway
- Security best practices

**When to use:** When you want full control, have technical expertise, or want to minimize platform fees.

### [Email Setup (Resend)](./email-setup.md)
**What it covers:**
- Resend account setup and API configuration
- Convex Resend component integration
- Email templates and sending functions
- Webhook event handling
- Production considerations

**When to use:** If you've enabled `email: true` in your configuration.

### [Monitoring Setup](./monitoring-setup.md)
**What it covers:**
- Sentry error reporting setup
- OpenStatus uptime monitoring
- Alert configuration
- Production monitoring best practices
- Troubleshooting monitoring issues

**When to use:** If you've enabled `monitoring: true` in your configuration.


## 🎯 Quick Start by Use Case

### 📱 **Simple Landing Page**
1. [Configuration Guide](./configuration.md) → Frontend-Only Config
2. [Running Locally](./running-locally.md)
3. [Deploy to Railway](./deploy-railway.md)

### 🔐 **User Dashboard App**
1. [Configuration Guide](./configuration.md) → Auth-Only Config  
2. [Running Locally](./running-locally.md)
3. [Deploy to Railway](./deploy-railway.md)

### 💳 **E-commerce Site**
1. [Configuration Guide](./configuration.md) → Payments-Only Config
2. [Running Locally](./running-locally.md)
3. [Deploy to Railway](./deploy-railway.md)

### 📧 **App with Email Notifications**
1. [Configuration Guide](./configuration.md) → Email-Enabled Config
2. [Email Setup](./email-setup.md)
3. [Running Locally](./running-locally.md)
4. [Deploy to Railway](./deploy-railway.md)

### 🚀 **Full SaaS Application**
1. [Configuration Guide](./configuration.md) → Full SaaS Config
2. [Running Locally](./running-locally.md)
3. [Email Setup](./email-setup.md) (if using email)
4. [Monitoring Setup](./monitoring-setup.md)
5. [Deploy to Railway](./deploy-railway.md)

## 🔗 External Resources

### Service Documentation
- [Clerk Authentication](https://clerk.com/docs)
- [Polar.sh Payments](https://docs.polar.sh)
- [Convex Backend](https://docs.convex.dev)
- [Resend Email](https://resend.com/docs)
- [Sentry Monitoring](https://docs.sentry.io)
- [OpenStatus Uptime](https://docs.openstatus.dev)

### Deployment Platforms
- [Railway Documentation](https://docs.railway.app/)
- [Docker Documentation](https://docs.docker.com/)
- [nginx Documentation](https://nginx.org/en/docs/)
- [React Router Documentation](https://reactrouter.com/en/main)

## 🆘 Getting Help

1. **Check the guides** - Most common issues are covered in the guides
2. **Review configuration** - Ensure your `config.ts` matches your intended setup
3. **Check environment variables** - Verify all required env vars are set
4. **Review logs** - Check Convex, Railway, and service dashboards for errors
5. **Create an issue** - If you're still stuck, create a GitHub issue with:
   - Your configuration
   - Error messages
   - Steps to reproduce

---

**Happy building!** 🎉 