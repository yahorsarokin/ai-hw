# Deployment Guide

This document provides comprehensive instructions for deploying the User Data Management application to various hosting platforms and setting up CI/CD pipelines.

## 🚀 Quick Deployment

### Prerequisites

Before deploying, ensure you have:

- A production-ready build (`npm run build`)
- All tests passing (`npm test`)
- No TypeScript errors (`npm run type-check`)
- Valid environment configuration

### Build Process

```bash
# 1. Install dependencies
npm ci

# 2. Run tests
npm test

# 3. Type check
npm run type-check

# 4. Build for production
npm run build

# 5. Verify build
npm run preview
```

## 🌐 Hosting Platforms

### Vercel (Recommended)

Vercel is optimal for React applications with excellent performance and developer experience.

#### Automatic Deployment

1. **Connect Repository**

   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Configure project settings

2. **Project Configuration**

   ```json
   {
     "name": "user-data-management",
     "version": 2,
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build",
         "config": {
           "distDir": "dist"
         }
       }
     ],
     "routes": [
       {
         "handle": "filesystem"
       },
       {
         "src": "/(.*)",
         "dest": "/index.html"
       }
     ]
   }
   ```

3. **Environment Variables**
   ```bash
   VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
   VITE_APP_TITLE="User Data Management"
   NODE_VERSION=18
   ```

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Netlify

Netlify offers simple deployment with powerful features for static sites.

#### Automatic Deployment

1. **Site Configuration** (`netlify.toml`)

   ```toml
   [build]
     base = "."
     command = "npm run build"
     publish = "dist"

   [build.environment]
     NODE_VERSION = "18"
     NPM_FLAGS = "--prefix=/dev/null"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [[headers]]
     for = "/static/*"
     [headers.values]
       cache-control = "max-age=31536000"
   ```

2. **Deploy Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

#### Manual Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

### GitHub Pages

GitHub Pages provides free hosting for open source projects.

#### Setup GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Type check
        run: npm run type-check

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v3

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: "./dist"

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

#### Vite Configuration for GitHub Pages

Update `vite.config.ts`:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/repository-name/" : "/",
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
```

### AWS S3 + CloudFront

For enterprise deployments with global CDN distribution.

#### S3 Setup

1. **Create S3 Bucket**

   ```bash
   aws s3 mb s3://your-app-name-prod
   ```

2. **Configure Bucket Policy**

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "PublicReadGetObject",
         "Effect": "Allow",
         "Principal": "*",
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::your-app-name-prod/*"
       }
     ]
   }
   ```

3. **Enable Static Website Hosting**
   ```bash
   aws s3 website s3://your-app-name-prod \
     --index-document index.html \
     --error-document index.html
   ```

#### CloudFront Distribution

```json
{
  "DistributionConfig": {
    "CallerReference": "user-data-management-prod",
    "Comment": "User Data Management Application",
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3Origin",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    },
    "Origins": [
      {
        "Id": "S3Origin",
        "DomainName": "your-app-name-prod.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ],
    "Enabled": true,
    "PriceClass": "PriceClass_All"
  }
}
```

#### Deployment Script

```bash
#!/bin/bash
# deploy-aws.sh

set -e

echo "Building application..."
npm run build

echo "Uploading to S3..."
aws s3 sync dist/ s3://your-app-name-prod --delete

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

## 🔄 CI/CD Pipelines

### GitHub Actions

#### Complete CI/CD Pipeline

Create `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: "18"

jobs:
  test:
    name: Test and Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-files
          path: dist/

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/

      - name: Deploy to staging
        run: |
          # Deployment commands for staging environment
          echo "Deploying to staging..."

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-files
          path: dist/

      - name: Deploy to production
        run: |
          # Deployment commands for production environment
          echo "Deploying to production..."
```

### GitLab CI/CD

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

cache:
  paths:
    - node_modules/

before_script:
  - apt-get update -qq && apt-get install -y -qq git curl
  - curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
  - apt-get install -y nodejs
  - npm ci

test:
  stage: test
  script:
    - npm run lint
    - npm run type-check
    - npm run test:coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy-staging:
  stage: deploy
  script:
    - echo "Deploying to staging..."
    # Add staging deployment commands
  environment:
    name: staging
    url: https://staging.your-app.com
  only:
    - develop

deploy-production:
  stage: deploy
  script:
    - echo "Deploying to production..."
    # Add production deployment commands
  environment:
    name: production
    url: https://your-app.com
  only:
    - main
```

## 🔧 Environment Configuration

### Environment Variables

#### Development (`.env.local`)

```bash
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_APP_TITLE="User Data Management (Dev)"
VITE_APP_VERSION="1.0.0-dev"
VITE_ENVIRONMENT="development"
```

#### Staging (`.env.staging`)

```bash
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_APP_TITLE="User Data Management (Staging)"
VITE_APP_VERSION="1.0.0-staging"
VITE_ENVIRONMENT="staging"
```

#### Production (`.env.production`)

```bash
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_APP_TITLE="User Data Management"
VITE_APP_VERSION="1.0.0"
VITE_ENVIRONMENT="production"
```

### Security Configuration

#### Content Security Policy

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://jsonplaceholder.typicode.com;
               font-src 'self';"
/>
```

#### Security Headers

```typescript
// For server-side frameworks (if using)
const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};
```

## 📊 Monitoring and Analytics

### Error Monitoring

#### Sentry Integration

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
  environment: import.meta.env.VITE_ENVIRONMENT,
});
```

### Performance Monitoring

#### Web Vitals

```typescript
// utils/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

function sendToAnalytics(metric: any) {
  // Send to your analytics service
  console.log(metric);
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## 🚦 Health Checks

### Application Health

Create `public/health.json`:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-01T00:00:00Z",
  "checks": {
    "api": "healthy",
    "build": "healthy"
  }
}
```

### Monitoring Script

```bash
#!/bin/bash
# health-check.sh

URL="https://your-app.com/health.json"
RESPONSE=$(curl -s -w "%{http_code}" "$URL")
HTTP_CODE="${RESPONSE: -3}"

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Health check passed"
    exit 0
else
    echo "❌ Health check failed (HTTP $HTTP_CODE)"
    exit 1
fi
```

## 🔄 Rollback Strategy

### Quick Rollback

#### Vercel

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

#### Netlify

```bash
# List site deployments
netlify api listSiteDeploys --data '{"site_id": "YOUR_SITE_ID"}'

# Restore deployment
netlify api restoreSiteDeploy --data '{"site_id": "YOUR_SITE_ID", "deploy_id": "DEPLOY_ID"}'
```

### Automated Rollback

```yaml
# .github/workflows/rollback.yml
name: Emergency Rollback

on:
  workflow_dispatch:
    inputs:
      deployment_id:
        description: "Deployment ID to rollback to"
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - name: Rollback deployment
        run: |
          # Rollback commands based on your hosting platform
          echo "Rolling back to deployment: ${{ github.event.inputs.deployment_id }}"
```

## 📋 Deployment Checklist

### Pre-Deployment

- [ ] All tests pass (`npm test`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables configured
- [ ] Security headers configured
- [ ] Error monitoring setup

### Post-Deployment

- [ ] Application loads correctly
- [ ] All functionality works as expected
- [ ] Performance metrics are acceptable
- [ ] Error monitoring is receiving data
- [ ] Health checks are passing
- [ ] DNS and SSL certificates are valid

### Production Verification

- [ ] Critical user flows tested
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed
- [ ] Accessibility standards met
- [ ] Performance benchmarks met
- [ ] Security scan completed

---

## 🆘 Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

#### Environment Variable Issues

```bash
# Verify environment variables
npm run build && npm run preview
# Check browser console for missing variables
```

#### Routing Issues (SPA)

Ensure your hosting platform serves `index.html` for all routes:

- Vercel: Automatic SPA routing
- Netlify: Add `_redirects` file
- AWS S3: Configure error document

For detailed troubleshooting, refer to the [Troubleshooting Guide](./TROUBLESHOOTING.md).

---

Happy deploying! 🚀
