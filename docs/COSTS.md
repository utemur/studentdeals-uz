# Cost Management & Service Quotas

Complete guide to service costs, quotas, and alerts for StudentDeals.uz infrastructure.

## Table of Contents

- [Overview](#overview)
- [Vercel (Web App)](#vercel-web-app)
- [Render (API)](#render-api)
- [Resend (Email)](#resend-email)
- [Sentry (Monitoring)](#sentry-monitoring)
- [Total Monthly Costs](#total-monthly-costs)
- [Cost Optimization](#cost-optimization)
- [Quota Alerts](#quota-alerts)
- [Scaling Strategy](#scaling-strategy)

---

## Overview

### Current Infrastructure

| Service | Purpose | Plan | Monthly Cost |
|---------|---------|------|--------------|
| **Vercel** | Web App (Next.js) | Pro | $20/month |
| **Render** | API (NestJS) + Database | Starter | $7 + $7 = $14/month |
| **Resend** | Email Delivery | Free | $0 (up to 3k emails) |
| **Sentry** | Error Tracking | Developer | $26/month |
| **GitHub** | Code Hosting + CI/CD | Free | $0 |
| **Total** | | | **~$60/month** |

### Free Tier Usage (Development)

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby | $0 |
| Render | Free | $0 |
| Resend | Free | $0 |
| Sentry | Developer (trial) | $0 |
| **Total** | | **$0** |

---

## Vercel (Web App)

### Plans & Pricing

| Plan | Price | Best For |
|------|-------|----------|
| **Hobby** | $0/month | Personal projects, testing |
| **Pro** | $20/month | Production apps |
| **Enterprise** | Custom | Large scale |

### Quotas (Pro Plan)

| Resource | Limit | Overage Cost |
|----------|-------|--------------|
| **Bandwidth** | 1 TB/month | $40/TB |
| **Build Execution** | 6000 min/month | $5/500 min |
| **Serverless Function** | 1000 GB-hours | $0.60/100 GB-hours |
| **Edge Requests** | 1M requests | $0.65/1M requests |
| **Image Optimization** | 5000 images | $5/1000 images |
| **Edge Middleware** | 1M requests | $0.65/1M requests |

### Current Usage Estimates

**Monthly Projections:**
- **Bandwidth:** ~50 GB (5% of limit)
- **Build Minutes:** ~500 min (8% of limit)
- **Serverless Functions:** ~50 GB-hours (5% of limit)
- **Edge Requests:** ~100k requests (10% of limit)
- **Image Optimization:** ~500 images (10% of limit)

**Cost:** $20/month (no overages expected)

### Quota Alerts

**Set alerts at:**
- 80% bandwidth usage (800 GB)
- 80% build minutes (4800 min)
- 80% edge requests (800k)

**How to Set:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Project Settings → Usage
3. Enable email alerts
4. Set thresholds

### Cost Optimization

**Reduce Bandwidth:**
- ✅ Enable ISR caching (revalidate: 60)
- ✅ Use CDN for static assets
- ✅ Compress images (AVIF/WebP)
- ✅ Enable gzip/brotli compression

**Reduce Build Minutes:**
- ✅ Use Turbo cache
- ✅ Skip unnecessary builds
- ✅ Optimize dependencies

**Reduce Function Execution:**
- ✅ Use Edge Functions where possible
- ✅ Cache API responses
- ✅ Optimize database queries

---

## Render (API)

### Plans & Pricing

| Service | Plan | Price |
|---------|------|-------|
| **Web Service** | Starter | $7/month |
| **PostgreSQL** | Starter | $7/month |
| **Total** | | **$14/month** |

### Quotas (Starter Plan)

**Web Service:**
- **RAM:** 512 MB
- **CPU:** 0.5 CPU
- **Bandwidth:** Unlimited
- **Build Minutes:** 500 min/month (free)

**PostgreSQL:**
- **Storage:** 1 GB
- **RAM:** Shared
- **Connections:** 97
- **Backups:** Daily (7 days retention)

### Current Usage Estimates

**Web Service:**
- **RAM:** ~200 MB (40% of limit)
- **CPU:** ~20% utilization
- **Build Minutes:** ~100 min/month (20% of limit)

**Database:**
- **Storage:** ~50 MB (5% of limit)
- **Connections:** ~10 concurrent (10% of limit)

**Cost:** $14/month (within limits)

### Quota Alerts

**Monitor:**
- Database storage > 800 MB (80%)
- RAM usage > 400 MB (80%)
- Connection pool > 75 connections (77%)

**How to Monitor:**
1. [Render Dashboard](https://dashboard.render.com)
2. Select service → Metrics
3. Enable Slack notifications

### Cost Optimization

**Reduce Memory:**
- ✅ Optimize Prisma client
- ✅ Use connection pooling
- ✅ Clean up unused dependencies

**Reduce Database:**
- ✅ Archive old data
- ✅ Compress logs
- ✅ Clean up expired tokens regularly

**Scaling Up:**
- **Standard Plan:** $25/month (2 GB RAM, 1 CPU)
- **Pro Plan:** $85/month (8 GB RAM, 2 CPU)

---

## Resend (Email)

### Plans & Pricing

| Plan | Price | Emails/Month | Price per Email |
|------|-------|--------------|-----------------|
| **Free** | $0 | 3,000 | $0 |
| **Pro** | $20 | 50,000 | $0.0004 |
| **Business** | $85 | 100,000 | $0.00085 |

### Current Plan: Free

**Quotas:**
- **Emails:** 3,000/month
- **Recipients:** 100/email
- **Attachments:** 40 MB
- **API Calls:** Unlimited
- **Custom Domain:** ✅ Yes
- **Analytics:** ✅ Yes

### Current Usage Estimates

**Monthly Projections:**
- **Verification Emails:** ~500 (new users)
- **Welcome Emails:** ~500 (new users)
- **Password Resets:** ~50
- **Newsletters:** ~0 (not implemented)
- **Total:** ~1,050 emails/month (35% of limit)

**Cost:** $0 (within free tier)

### Quota Alerts

**Set alerts at:**
- 2,400 emails/month (80% of limit)
- 2,700 emails/month (90% of limit)

**How to Monitor:**
1. [Resend Dashboard](https://resend.com/emails)
2. View → Analytics
3. Set up webhooks for quota warnings

### Cost Optimization

**Stay in Free Tier:**
- ✅ Limit verification email resends (max 3)
- ✅ Rate limit password resets (1/hour)
- ✅ Use email templates efficiently
- ✅ Batch emails if possible

**When to Upgrade:**
- > 2,500 emails/month consistently
- Need higher sending rates
- Require dedicated IPs

**Pro Plan Benefits:**
- 50k emails/month
- Higher sending rate
- Priority support
- Advanced analytics

---

## Sentry (Monitoring)

### Plans & Pricing

| Plan | Price | Events/Month | Transactions |
|------|-------|--------------|--------------|
| **Developer** | $26/month | 50,000 | 100,000 |
| **Team** | $80/month | 100,000 | 500,000 |
| **Business** | $240/month | 500,000 | 2,000,000 |

### Current Plan: Developer

**Quotas:**
- **Error Events:** 50,000/month
- **Performance Transactions:** 100,000/month
- **Replays:** 500/month
- **Attachments:** 1 GB
- **Projects:** Unlimited
- **Team Members:** 1

### Current Usage Estimates

**Monthly Projections (with 10% sample rate):**
- **Error Events:** ~5,000 (10% of limit)
- **Transactions:** ~50,000 (50% of limit)
- **Replays:** ~100 (20% of limit)

**Cost:** $26/month (within limits)

### Sample Rates Impact

**Current Configuration:**

| Environment | Traces | Replays (Session) | Replays (Error) |
|-------------|--------|-------------------|-----------------|
| Development | 100% | 50% | 100% |
| Production | 10% | 10% | 100% |

**With 10,000 daily users:**
- **Transactions/day:** ~100,000 requests × 10% = 10,000 sampled
- **Transactions/month:** ~300,000 → **Too high!**
- **Need:** Reduce to 3% sample rate or upgrade plan

### Quota Alerts

**Set alerts at:**
- 40,000 errors/month (80%)
- 80,000 transactions/month (80%)

**How to Set:**
1. [Sentry Dashboard](https://sentry.io/organizations/studentdeals/)
2. Settings → Quotas
3. Enable email alerts
4. Set thresholds

**Automatic Actions:**
- Spike protection: Auto-disables at 100%
- Rate limiting: Drops excess events
- Notifications: Email + Slack

### Cost Optimization

**Reduce Error Events:**
- ✅ Fix bugs (fewer errors = fewer events)
- ✅ Use `ignoreErrors` for known issues
- ✅ Filter out development errors
- ✅ Use `beforeSend` to drop non-critical errors

**Reduce Transactions:**
- ✅ Lower sample rate (10% → 5% → 3%)
- ✅ Skip health check transactions
- ✅ Skip static asset transactions
- ✅ Use `beforeSendTransaction` to filter

**Reduce Replays:**
- ✅ Lower session sample rate (10% → 5%)
- ✅ Keep error sample rate high (100%)
- ✅ Mask sensitive data
- ✅ Filter by user type

**Sample Rate Adjustment:**

```typescript
// Reduce to 3% for lower costs
tracesSampleRate: IS_PRODUCTION ? 0.03 : 1.0,
replaysSessionSampleRate: IS_PRODUCTION ? 0.03 : 0.5,
```

### When to Upgrade

**Team Plan ($80/month):**
- > 40,000 errors/month
- > 80,000 transactions/month
- Need more team members
- Need advanced features

**Business Plan ($240/month):**
- > 100,000 errors/month
- > 500,000 transactions/month
- Enterprise requirements

---

## Total Monthly Costs

### Current Configuration (Production)

| Service | Plan | Monthly Cost | Annual Cost |
|---------|------|--------------|-------------|
| Vercel (Web) | Pro | $20 | $240 |
| Render (API) | Starter | $7 | $84 |
| Render (DB) | Starter | $7 | $84 |
| Resend | Free | $0 | $0 |
| Sentry | Developer | $26 | $312 |
| GitHub | Free | $0 | $0 |
| **Total** | | **$60** | **$720** |

### With Growth (10k active users)

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Vercel | Pro | $20 |
| Render API | Standard | $25 |
| Render DB | Standard | $20 |
| Resend | Pro | $20 |
| Sentry | Team | $80 |
| **Total** | | **$165** |

### With Scale (100k active users)

| Service | Plan | Monthly Cost |
|---------|------|--------------|
| Vercel | Pro | $20-50 (overages) |
| Render API | Pro | $85 |
| Render DB | Pro | $90 |
| Resend | Business | $85 |
| Sentry | Business | $240 |
| **Total** | | **$520-550** |

---

## Cost Optimization

### Quick Wins

**1. Optimize Sentry Sample Rate**
```typescript
// Current: 10% = 100k transactions/month
tracesSampleRate: 0.10

// Optimized: 3% = 30k transactions/month
tracesSampleRate: 0.03

// Savings: Stay in Developer plan
```

**2. Use Render Free Tier for Staging**
```yaml
# Free tier for staging environment
# Spins down after 15 min inactivity
# $0/month for non-production
```

**3. Optimize Images**
```typescript
// Use AVIF (60-70% smaller than JPEG)
// Reduce Vercel image optimization costs
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60,
}
```

**4. Cache Aggressively**
```typescript
// Reduce serverless function execution
export const revalidate = 60; // ISR caching
```

### Long-Term Optimizations

**Move to Self-Hosted:**
- **VPS (DigitalOcean/Hetzner):** $12-24/month
- **Database:** Included or $10/month
- **Savings:** ~$40/month
- **Trade-off:** More maintenance

**Use CDN for Static Assets:**
- **Cloudflare CDN:** Free
- **BunnyCDN:** $1/TB
- **Savings:** Reduce Vercel bandwidth

**Self-Hosted Email:**
- **AWS SES:** $0.10/1000 emails
- **Savings:** ~$15/month at scale
- **Trade-off:** More complex setup

---

## Quota Alerts

### Vercel Alerts

**Dashboard:** https://vercel.com/dashboard → Usage

**Email Alerts (Recommended):**
- ✅ 80% bandwidth (800 GB)
- ✅ 80% build minutes (4800 min)
- ✅ 80% edge requests (800k)

**Slack Webhook:**
```bash
# Set up Slack integration
# Vercel → Integrations → Slack
# Get notifications for quota warnings
```

---

### Render Alerts

**Dashboard:** https://dashboard.render.com → Metrics

**Built-in Alerts:**
- ✅ High memory usage (> 90%)
- ✅ High CPU usage (> 90%)
- ✅ Service restarts
- ✅ Build failures

**Custom Alerts (via Slack):**
```yaml
# render.yaml
services:
  - type: web
    envVars:
      - key: SLACK_WEBHOOK_URL
        sync: false
    
    # Health check alerts
    healthCheckPath: /health
    
    # Auto-deploy alerts
    notifyOnFail: true
```

**Database Alerts:**
- ✅ Storage > 800 MB (80%)
- ✅ Connection pool > 75 (77%)
- ✅ Slow queries > 1s

---

### Resend Alerts

**Dashboard:** https://resend.com/emails → Analytics

**Email Quota Alerts:**
```javascript
// Add to your code
const checkEmailQuota = async () => {
  const usage = await resend.emails.getUsage();
  
  if (usage.sent > 2400) { // 80% of 3000
    console.warn('⚠️  Resend quota at 80%');
    // Send alert to Slack
  }
};
```

**API Webhook for Quota:**
```bash
# Resend doesn't have built-in quota webhooks
# Monitor via API:
curl https://api.resend.com/emails/usage \
  -H "Authorization: Bearer $RESEND_API_KEY"
```

**Manual Monitoring:**
- Check daily in dashboard
- Set calendar reminder
- Track in spreadsheet

---

### Sentry Alerts

**Dashboard:** https://sentry.io/organizations/studentdeals/ → Quotas

**Built-in Alerts:**
- ✅ 80% quota usage (auto-enabled)
- ✅ 100% quota usage (spike protection)
- ✅ Email notifications
- ✅ Slack notifications

**Quota Management:**
```bash
# View quota usage
sentry-cli quotas list

# View current usage
curl -H "Authorization: Bearer $SENTRY_AUTH_TOKEN" \
  https://sentry.io/api/0/organizations/studentdeals/stats/
```

**Automatic Spike Protection:**
- Drops events when quota reached
- Prevents overage charges
- Notifications sent

---

## Scaling Strategy

### Tier 1: Launch (< 1k users)

**Current Setup:**
- Vercel: Hobby ($0) or Pro ($20)
- Render: Free ($0) or Starter ($14)
- Resend: Free ($0)
- Sentry: Developer ($26)
- **Total:** $0-60/month

**Sufficient for:**
- 1,000 active users
- 10,000 page views/month
- 1,000 emails/month
- 10,000 API requests/day

---

### Tier 2: Growth (1k-10k users)

**Recommended:**
- Vercel: Pro ($20)
- Render API: Standard ($25)
- Render DB: Standard ($20)
- Resend: Pro ($20)
- Sentry: Team ($80)
- **Total:** $165/month

**Handles:**
- 10,000 active users
- 100,000 page views/month
- 10,000 emails/month
- 100,000 API requests/day

---

### Tier 3: Scale (10k-100k users)

**Recommended:**
- Vercel: Pro ($20-50 with overages)
- Render API: Pro ($85)
- Render DB: Pro ($90)
- Resend: Business ($85)
- Sentry: Business ($240)
- **Total:** $520-550/month

**Handles:**
- 100,000 active users
- 1,000,000 page views/month
- 50,000 emails/month
- 1,000,000 API requests/day

---

### Tier 4: Enterprise (> 100k users)

**Consider:**
- Self-hosted infrastructure
- Dedicated servers
- Load balancing
- Multi-region deployment
- **Estimated:** $1,000-2,000/month

---

## Monitoring Costs

### Daily Checks

**Vercel:**
```bash
# Check bandwidth usage
# Vercel Dashboard → Analytics → Bandwidth
```

**Render:**
```bash
# Check memory and CPU
# Render Dashboard → Metrics
```

**Resend:**
```bash
# Check email quota
curl https://api.resend.com/emails/usage \
  -H "Authorization: Bearer $RESEND_API_KEY"
```

**Sentry:**
```bash
# Check quota usage
sentry-cli quotas list
```

### Weekly Reports

**Create monitoring script:**

```javascript
// scripts/check-quotas.js
const services = {
  vercel: checkVercelUsage(),
  render: checkRenderUsage(),
  resend: checkResendUsage(),
  sentry: checkSentryUsage(),
};

// Send weekly summary to Slack
sendSlackReport(services);
```

---

## Cost Breakdown by Feature

### Feature Costs

| Feature | Service | Monthly Cost | Notes |
|---------|---------|--------------|-------|
| **Web Hosting** | Vercel | $20 | Static + SSR |
| **API Hosting** | Render | $7 | 512 MB RAM |
| **Database** | Render | $7 | 1 GB storage |
| **Email** | Resend | $0 | < 3k emails |
| **Monitoring** | Sentry | $26 | 50k errors |
| **CI/CD** | GitHub | $0 | Free tier |
| **Total** | | **$60** | |

### Cost per User

**At 1,000 users:**
- $60/month ÷ 1,000 = **$0.06/user/month**

**At 10,000 users:**
- $165/month ÷ 10,000 = **$0.0165/user/month**

**At 100,000 users:**
- $550/month ÷ 100,000 = **$0.0055/user/month**

---

## Emergency Procedures

### Unexpected Overage

**If quota exceeded:**

1. **Check Sentry** - Are we being attacked?
2. **Check Vercel** - Unusual traffic spike?
3. **Check Resend** - Email loop?
4. **Take Action:**
   - Enable rate limiting
   - Block suspicious IPs
   - Disable non-critical features
   - Scale down if needed

### DDoS Attack

**If under attack:**

1. **Enable Vercel Firewall** (Pro plan)
2. **Add rate limiting** (already have Throttler)
3. **Block IPs** in Cloudflare/Vercel
4. **Contact support** for help

### Cost Spike

**If costs spike unexpectedly:**

1. **Identify source** (which service?)
2. **Check usage** (bandwidth? emails? errors?)
3. **Investigate cause** (bug? attack? growth?)
4. **Take action:**
   - Fix bug if causing errors
   - Add caching if bandwidth
   - Optimize if legitimate growth

---

## Budget Planning

### Monthly Budget

| Item | Current | Growth (10k) | Scale (100k) |
|------|---------|--------------|--------------|
| Infrastructure | $60 | $165 | $550 |
| Development | $0 | $200 | $1,000 |
| Support | $0 | $100 | $500 |
| **Total** | **$60** | **$465** | **$2,050** |

### Yearly Costs

| Tier | Monthly | Yearly | Users |
|------|---------|--------|-------|
| Launch | $60 | $720 | < 1k |
| Growth | $165 | $1,980 | 1k-10k |
| Scale | $550 | $6,600 | 10k-100k |

### Break-Even Analysis

**Assuming $5/user/month revenue:**
- **Launch:** 12 paying users
- **Growth:** 33 paying users
- **Scale:** 110 paying users

---

## Resources

### Service Dashboards

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Render Dashboard](https://dashboard.render.com)
- [Resend Dashboard](https://resend.com/emails)
- [Sentry Dashboard](https://sentry.io/organizations/studentdeals/)

### Pricing Pages

- [Vercel Pricing](https://vercel.com/pricing)
- [Render Pricing](https://render.com/pricing)
- [Resend Pricing](https://resend.com/pricing)
- [Sentry Pricing](https://sentry.io/pricing/)

### Cost Calculators

- [Vercel Cost Estimator](https://vercel.com/docs/platform/limits#cost-estimator)
- [AWS Pricing Calculator](https://calculator.aws/)

---

## Recommendations

### Current Phase (Launch)

**Recommended:**
- ✅ Vercel Pro ($20) - Professional plan for production
- ✅ Render Starter ($14) - Adequate for < 1k users
- ✅ Resend Free ($0) - More than enough for launch
- ✅ Sentry Developer ($26) - Good monitoring coverage

**Total: $60/month**

### Next 6 Months (Growth)

**Monitor these metrics:**
- Daily active users
- Email sending rate
- Sentry quota usage
- Render memory usage
- Vercel bandwidth

**Upgrade when:**
- Resend > 2,500 emails/month
- Sentry > 40k transactions/month
- Render RAM > 80%
- Vercel bandwidth > 800 GB

### Cost Alerts

**Set up alerts for:**
- ✅ Any service > 80% quota
- ✅ Weekly cost reports
- ✅ Unexpected spikes
- ✅ Failed payments

---

**Last Updated:** 2025-10-11  
**Version:** 1.0  
**Owner:** Engineering Team  
**Review:** Monthly

