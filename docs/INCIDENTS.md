# Incident Management & On-Call Guide

Complete guide for incident response, on-call procedures, and system reliability for StudentDeals.uz.

## Table of Contents

- [Quick Reference](#quick-reference)
- [SLO/SLA Targets](#slosla-targets)
- [On-Call Responsibilities](#on-call-responsibilities)
- [Alert Channels](#alert-channels)
- [Incident Response](#incident-response)
- [Rollback Procedures](#rollback-procedures)
- [Runbooks](#runbooks)
- [Post-Incident](#post-incident)
- [Escalation](#escalation)

## Quick Reference

### 🚨 Critical Issues (P0)

**Definition:** Complete service outage, data loss, security breach

**Response Time:** 15 minutes  
**Resolution Time:** 4 hours  
**Actions:**
1. Acknowledge alert immediately
2. Join incident Slack channel
3. Start incident call
4. Execute rollback if needed
5. Post updates every 15 minutes

### ⚠️ High Priority (P1)

**Definition:** Major feature broken, degraded performance, partial outage

**Response Time:** 1 hour  
**Resolution Time:** 24 hours  
**Actions:**
1. Acknowledge alert
2. Assess impact
3. Fix or rollback
4. Post updates every hour

### 📊 Medium Priority (P2)

**Definition:** Minor feature broken, non-critical bugs

**Response Time:** 4 hours  
**Resolution Time:** 1 week  

### 📝 Low Priority (P3)

**Definition:** Cosmetic issues, improvements

**Response Time:** 1 day  
**Resolution Time:** 1 month  

---

## SLO/SLA Targets

### Service Level Objectives (Internal)

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Availability** | 99.9% | Uptime per month (43 min downtime allowed) |
| **API Response Time (p95)** | < 500ms | 95th percentile response time |
| **API Response Time (p99)** | < 1000ms | 99th percentile response time |
| **Error Rate** | < 0.1% | Failed requests / total requests |
| **Database Query Time (p95)** | < 200ms | 95th percentile query time |
| **Page Load Time (p75)** | < 2s | 75th percentile FCP |
| **Web Vitals - LCP** | < 2.5s | Largest Contentful Paint |
| **Web Vitals - CLS** | < 0.1 | Cumulative Layout Shift |

### Service Level Agreements (Customer-Facing)

| Service | Availability | Support Response | Credits |
|---------|--------------|------------------|---------|
| **Production API** | 99.5% | P0: 15min, P1: 1hr | 10% monthly fee per 1% downtime |
| **Web Application** | 99.5% | P0: 15min, P1: 1hr | 10% monthly fee per 1% downtime |
| **Email Delivery** | 99.0% | P1: 4hr | 5% monthly fee per 1% failure |

### Error Budgets

**Monthly Error Budget:** 0.1% (99.9% availability target)

- **Available Minutes:** 43 minutes downtime per month
- **Available Errors:** 0.1% of total requests

**Budget Consumption:**
- ✅ **< 50%:** Normal operations
- ⚠️ **50-80%:** Caution, investigate issues
- 🚨 **> 80%:** Feature freeze, focus on reliability

**Tracking:**
```bash
# Check current error budget
curl https://api.studentdeals.uz/metrics/error-budget

# View in Sentry
# Project Settings → Performance → Error Budget
```

---

## On-Call Responsibilities

### Primary On-Call

**Duration:** 1 week rotation (Monday 9:00 AM - Monday 9:00 AM)

**Responsibilities:**
- ✅ Monitor alerts 24/7
- ✅ Respond within SLO timeframes
- ✅ Acknowledge all alerts
- ✅ Execute incident response procedures
- ✅ Escalate if needed
- ✅ Write post-incident reports
- ✅ Keep stakeholders informed

**Tools Access:**
- Production AWS/Vercel/Render
- Sentry (error tracking)
- Slack (alerts)
- PagerDuty (optional)
- GitHub (deployments)
- Datadog/Grafana (monitoring)

### Secondary On-Call

**Responsibilities:**
- ✅ Backup for primary
- ✅ Respond if primary unavailable (30 min)
- ✅ Assist with P0 incidents
- ✅ Review post-incident reports

### On-Call Handoff

**Every Monday 9:00 AM:**

1. **Outgoing Engineer:**
   - Write handoff notes
   - List ongoing issues
   - Highlight any concerns
   - Share access credentials (rotate if needed)

2. **Incoming Engineer:**
   - Read handoff notes
   - Test alert channels
   - Verify access to all tools
   - Review recent incidents

**Handoff Template:**
```markdown
## On-Call Handoff - [Date]

### Ongoing Issues
- Issue #1: Description, status, next steps
- Issue #2: Description, status, next steps

### Recent Incidents
- [Date] P0: Brief description, resolution
- [Date] P1: Brief description, resolution

### Action Items
- [ ] Task 1
- [ ] Task 2

### System Status
- Error budget: X% consumed
- Known issues: List
- Deployments this week: List

### Notes
- Any other important information
```

---

## Alert Channels

### Sentry Alerts

**Configuration:** `sentry.io/organizations/studentdeals/alerts/`

**Alert Rules:**

| Alert | Condition | Severity | Channel |
|-------|-----------|----------|---------|
| High Error Rate | > 100 errors/min | P0 | Slack + PagerDuty |
| API Latency | p95 > 1000ms for 5 min | P1 | Slack |
| Database Errors | Any Prisma error | P0 | Slack + PagerDuty |
| New Release Error | > 50 errors on new release | P0 | Slack |
| Memory Usage | > 90% for 10 min | P1 | Slack |
| Unresolved Issues | > 100 unresolved issues | P2 | Email |

**Setup:**
```bash
# Sentry CLI (already configured)
sentry-cli alerts list

# Test alert
curl -X POST https://sentry.io/api/0/projects/.../alerts/test/
```

### Slack Channels

| Channel | Purpose | Alerts |
|---------|---------|--------|
| `#incidents` | Active incidents | P0, P1 alerts |
| `#monitoring` | System health | All automated alerts |
| `#deployments` | Deploy notifications | Deploy start/success/failure |
| `#on-call` | On-call communication | Handoffs, schedule |

**Slack Integration:**
- Sentry → `#incidents` (P0, P1)
- Sentry → `#monitoring` (all errors)
- GitHub Actions → `#deployments`
- Vercel → `#deployments`

### PagerDuty (Optional)

**Services:**
- `studentdeals-api` - API incidents
- `studentdeals-web` - Web incidents
- `studentdeals-database` - DB incidents

**Escalation Policy:**
1. Primary on-call (immediate)
2. Secondary on-call (+15 min)
3. Engineering lead (+30 min)
4. CTO (+60 min)

---

## Incident Response

### Step 1: Acknowledge

**Within 15 minutes for P0, 1 hour for P1**

```bash
# Acknowledge in Slack
/incident ack "Brief description"

# Acknowledge in Sentry
# Click "Acknowledge" on issue page

# Acknowledge in PagerDuty
# Tap notification → Acknowledge
```

### Step 2: Assess

**Gather information:**

```bash
# Check system health
curl https://api.studentdeals.uz/health
curl https://api.studentdeals.uz/health/db

# Check Sentry dashboard
# Issues → Last 24h → Sort by frequency

# Check error rate
# Sentry → Performance → Error Rate graph

# Check logs (if using Render/Vercel)
# Render: Dashboard → API → Logs
# Vercel: Project → Deployments → Logs

# Check recent deployments
gh api /repos/studentdeals-uz/studentdeals/deployments \
  --jq '.[0:5]'
```

**Assess impact:**
- How many users affected?
- What functionality is broken?
- Is data at risk?
- Revenue impact?

### Step 3: Communicate

**Start incident thread:**

```markdown
# Slack - #incidents

🚨 **INCIDENT: [Brief Title]**

**Severity:** P0 / P1 / P2
**Started:** [Time]
**Impact:** [Brief description]
**On-call:** @engineer

**Status:** INVESTIGATING

**Next update:** [Time]
```

**Update every 15 min (P0) or 1 hour (P1):**

```markdown
**UPDATE [HH:MM]:**
- What we know
- What we're doing
- ETA for next update
```

### Step 4: Mitigate

**Quick fixes:**

```bash
# 1. Rollback deployment (fastest)
See "Rollback Procedures" section

# 2. Disable feature flag
# If using feature flags
curl -X POST https://api.studentdeals.uz/admin/features/disable \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"feature": "feature-name"}'

# 3. Scale up resources
# Render: Dashboard → Service → Manual Deploy → Scale
# Vercel: Automatic scaling

# 4. Restart service
# Render: Dashboard → Service → Manual Deploy → Restart
# Kill and restart PM2 process if self-hosted

# 5. Clear cache
curl -X POST https://api.studentdeals.uz/admin/cache/clear \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### Step 5: Resolve

**After fix deployed:**

```markdown
# Slack update

✅ **INCIDENT RESOLVED: [Title]**

**Resolution:** [Brief description]
**Root cause:** [Brief cause]
**Duration:** [Start - End]
**Impact:** [Summary]

**Follow-up:**
- [ ] Write post-incident report
- [ ] Create GitHub issues for action items
- [ ] Update runbooks
```

**Close in Sentry:**
- Mark issue as "Resolved in next release"
- Add resolution comment
- Link to GitHub commit/PR

---

## Rollback Procedures

### 🚨 When to Rollback

**Immediate rollback (no questions):**
- Data corruption or loss
- Complete service outage
- Security vulnerability exposed
- Critical functionality broken
- Error rate > 5%

**Consider rollback:**
- Degraded performance
- Non-critical feature broken
- Error rate > 1%
- Customer complaints

**Don't rollback:**
- Minor UI issues
- Single user reports
- Expected behavior
- Error rate < 0.5%

---

### Rollback: Vercel (Web App)

**Method 1: Dashboard (Easiest)**

```bash
1. Go to: https://vercel.com/studentdeals/web
2. Deployments → Find last stable deployment
3. Click ⋯ → "Promote to Production"
4. Confirm
5. Wait 30-60 seconds for deployment
6. Verify: https://studentdeals.uz
```

**Method 2: CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# List recent deployments
vercel ls studentdeals-web

# Promote previous deployment
vercel promote <deployment-url>

# Example:
vercel promote studentdeals-web-abc123.vercel.app
```

**Method 3: Git Revert**

```bash
# Find last stable commit
git log --oneline -n 10

# Revert to that commit
git revert <commit-hash> --no-edit

# Push (triggers auto-deploy)
git push origin main

# OR: Create revert PR (safer)
git checkout -b revert-deploy
git revert <commit-hash> --no-edit
git push origin revert-deploy
gh pr create --title "Revert: [description]" --body "Rollback due to incident"
```

**Verification:**

```bash
# Check deployment status
curl -I https://studentdeals.uz | grep -i x-vercel

# Check Sentry for new errors
# Sentry → Issues → Last 15 minutes

# Test critical paths
curl https://studentdeals.uz/ru
curl https://studentdeals.uz/ru/signin
```

---

### Rollback: Render (API)

**Method 1: Dashboard**

```bash
1. Go to: https://dashboard.render.com
2. Select "api" service
3. "Manual Deploy" → "Deploy History"
4. Find last stable deployment
5. Click "Redeploy"
6. Confirm and wait 2-5 minutes
7. Verify: https://api.studentdeals.uz/health
```

**Method 2: Git Revert**

```bash
# Same as Vercel Git Revert above
# Render will auto-deploy from main branch

git revert <commit-hash> --no-edit
git push origin main

# Monitor deployment
# Render Dashboard → API → Events
```

**Method 3: Docker Rollback (if self-hosted)**

```bash
# SSH to server
ssh deploy@api.studentdeals.uz

# Find previous image
docker images | grep studentdeals-api

# Stop current container
docker stop studentdeals-api

# Start previous version
docker run -d \
  --name studentdeals-api \
  --env-file .env.production \
  -p 3001:3001 \
  studentdeals-api:previous-tag

# Or use Docker Compose
docker-compose down
docker-compose up -d --build
```

**Verification:**

```bash
# Health check
curl https://api.studentdeals.uz/health
curl https://api.studentdeals.uz/health/db

# Check Sentry
# Sentry → Projects → API → Issues → Last 15 min

# Test critical endpoints
curl -X POST https://api.studentdeals.uz/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

### Rollback: Database Migrations

**⚠️ DANGER ZONE - Be very careful!**

**Never rollback if:**
- Data has been deleted
- Schema breaking changes deployed > 24 hours ago
- Multiple migrations since issue

**Safe rollback (< 1 hour since deploy):**

```bash
# SSH to API server or run locally with prod DB URL
ssh deploy@api.studentdeals.uz

# Check migration history
pnpm --filter api exec prisma migrate status

# Revert last migration (if safe)
pnpm --filter api exec prisma migrate resolve --rolled-back <migration-name>

# Re-run previous migrations
pnpm --filter api exec prisma migrate deploy

# Generate Prisma Client
pnpm --filter api exec prisma generate
```

**If data integrity at risk:**

1. **STOP - Don't rollback**
2. Take database snapshot
3. Consult with DB expert
4. Write forward migration to fix
5. Test in staging first

**Database Snapshot:**

```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Restore if needed
psql $DATABASE_URL < backup-file.sql
```

---

## Runbooks

### Runbook: High Error Rate

**Symptoms:**
- Sentry alert: > 100 errors/min
- Dashboard shows spike in errors
- User reports of failures

**Investigation:**

```bash
# 1. Check Sentry
# Which errors are most frequent?
# Is it a new error or existing?
# Which release introduced it?

# 2. Check recent deployments
gh api /repos/studentdeals-uz/studentdeals/deployments \
  --jq '.[0:3] | .[] | {created_at, sha, environment}'

# 3. Check affected endpoints
# Sentry → Issues → Group by URL

# 4. Check error details
# Sentry → Issue → Breadcrumbs → Context
```

**Resolution:**

```bash
# If from new deployment → Rollback
See "Rollback Procedures"

# If from external service → Check status pages
curl https://status.vercel.com
curl https://status.render.com

# If database issue → Check DB health
curl https://api.studentdeals.uz/health/db

# Check DB connections
# Render: Dashboard → Database → Metrics

# If API overload → Scale up
# Render: Dashboard → Service → Scaling
```

---

### Runbook: API Latency Spike

**Symptoms:**
- Slow response times (> 1s)
- Sentry performance alerts
- User complaints

**Investigation:**

```bash
# 1. Check Sentry Performance
# Sentry → Performance → Overview
# Which transactions are slow?

# 2. Check database queries
# Sentry → Performance → Database queries
# Any slow queries (> 500ms)?

# 3. Check external API calls
# Are we waiting on third-party APIs?

# 4. Check server resources
# Render: Dashboard → Metrics
# CPU, Memory, Network usage
```

**Resolution:**

```bash
# Slow database queries
# → Add indexes (see prisma/schema.prisma)
# → Optimize query (reduce N+1)
# → Add caching

# High CPU
# → Scale up (more instances)
# → Optimize code (remove heavy operations)

# High Memory
# → Check for memory leaks
# → Restart service
# → Scale up

# Slow external API
# → Add timeout
# → Add caching
# → Use async processing
```

---

### Runbook: Database Connection Errors

**Symptoms:**
- Errors: "Can't reach database server"
- Prisma errors in Sentry
- /health/db returns 503

**Investigation:**

```bash
# 1. Check database status
# Render: Dashboard → Database → Status

# 2. Check connection string
echo $DATABASE_URL | sed 's/:[^:]*@/@/g'

# 3. Check connection pool
# Prisma connection pool exhausted?

# 4. Check database logs
# Render: Dashboard → Database → Logs
```

**Resolution:**

```bash
# Database down
# → Check provider status
# → Restart database (Render dashboard)
# → Contact support if needed

# Connection pool exhausted
# → Increase pool size in Prisma
# → Check for leaked connections
# → Restart API service

# Network issue
# → Check firewall rules
# → Check security groups
# → Verify DATABASE_URL
```

---

### Runbook: Out of Memory

**Symptoms:**
- Service crashes
- "Out of memory" errors
- Service restarts automatically

**Investigation:**

```bash
# 1. Check memory usage
# Render: Dashboard → Metrics → Memory

# 2. Check recent code changes
# Did we add memory-intensive features?

# 3. Check Sentry for memory-related errors

# 4. Check for memory leaks
# Node.js heap snapshots
```

**Resolution:**

```bash
# Immediate: Scale up
# Render: Increase instance size

# Short-term: Restart service
# Clears memory leaks temporarily

# Long-term: Fix memory leaks
# → Profile with Node.js profiler
# → Check for circular references
# → Check for event listener leaks
# → Optimize caching
```

---

### Runbook: Email Delivery Failure

**Symptoms:**
- Users not receiving emails
- Resend API errors
- Verification emails failing

**Investigation:**

```bash
# 1. Check Resend dashboard
# https://resend.com/emails
# Are emails being sent?

# 2. Check Resend API status
curl https://status.resend.com

# 3. Check API logs for Resend errors
# Sentry → Search "resend" OR "email"

# 4. Check RESEND_API_KEY
# Is it set correctly?
```

**Resolution:**

```bash
# Resend API down
# → Wait for service recovery
# → Implement email queue for retry

# Invalid API key
# → Verify RESEND_API_KEY
# → Regenerate if needed

# Rate limit exceeded
# → Check Resend quota
# → Upgrade plan if needed
# → Implement rate limiting

# Emails in spam
# → Check SPF/DKIM/DMARC records
# → Verify domain authentication
# → Contact Resend support
```

---

## Post-Incident

### Post-Incident Report (PIR)

**Required for P0 and P1 incidents within 48 hours**

**Template:**

```markdown
# Post-Incident Report: [Title]

**Date:** [YYYY-MM-DD]  
**Severity:** P0 / P1  
**Duration:** [Start time] - [End time] ([duration])  
**Impact:** [Brief summary]  
**Author:** [Engineer name]

## Summary

Brief summary of what happened.

## Timeline

| Time | Event |
|------|-------|
| 14:00 | Incident started |
| 14:15 | Alert received |
| 14:20 | Incident acknowledged |
| 14:30 | Root cause identified |
| 14:45 | Fix deployed |
| 15:00 | Incident resolved |

## Impact

- **Users affected:** X users (Y%)
- **Requests failed:** X requests
- **Revenue impact:** $X
- **Error budget consumed:** X%

## Root Cause

Detailed explanation of what caused the incident.

## Resolution

How we fixed it.

## What Went Well

- Quick detection (15 min)
- Fast rollback (30 min)
- Good communication

## What Didn't Go Well

- Alerting delay
- Rollback process unclear
- Monitoring gap

## Action Items

- [ ] Add monitoring for X (Owner: @engineer, Due: DATE)
- [ ] Update runbook for Y (Owner: @engineer, Due: DATE)
- [ ] Add test for Z (Owner: @engineer, Due: DATE)
- [ ] Improve alerting for W (Owner: @engineer, Due: DATE)

## Lessons Learned

Key takeaways for future incidents.
```

**Distribution:**
- Post in `#incidents` Slack
- Add to `docs/incidents/` directory
- Review in next team meeting
- Track action items in GitHub issues

---

## Escalation

### When to Escalate

**Escalate immediately if:**
- You're stuck and don't know what to do
- Incident duration > 2 hours with no progress
- Data loss or corruption
- Security breach suspected
- Need additional permissions/access
- Impact larger than initially assessed
- Customer-facing SLA breach

### Escalation Path

**Level 1: Secondary On-Call**
- If primary unavailable or needs help
- For P0 incidents (always escalate)
- Response time: 15 minutes

**Level 2: Engineering Lead**
- If Level 1 can't resolve
- For critical decisions
- Response time: 30 minutes

**Level 3: CTO**
- For major incidents
- Customer communication needed
- Business continuity decisions
- Response time: 1 hour

**Level 4: CEO**
- For company-wide impact
- PR/Communications needed
- Legal implications

### How to Escalate

**Slack:**
```
@secondary-oncall ESCALATION: [Brief description]
Incident: [Link to incident thread]
Tried: [What you've tried]
Need: [What you need]
```

**Phone/SMS:**
- Use emergency contact list
- Only for P0 if Slack fails

**PagerDuty:**
- Use "Escalate" button
- Follows predefined policy

---

## Tools & Access

### Required Access

- **GitHub:** Owner/Admin access
- **Vercel:** Owner access to project
- **Render:** Owner/Admin access to services
- **Sentry:** Admin access to projects
- **Resend:** API access
- **Slack:** All channels
- **AWS/Cloud:** Production read/write
- **Database:** Read-only access (write only via migrations)

### Testing On-Call Setup

```bash
# 1. Verify Slack notifications
# Sentry → Settings → Integrations → Slack → Test

# 2. Verify Sentry alerts
# Sentry → Alerts → Test alert

# 3. Verify access
vercel whoami
gh auth status
sentry-cli info

# 4. Test rollback (staging)
# Follow rollback procedures in staging environment

# 5. Test health checks
curl https://api.studentdeals.uz/health
curl https://studentdeals.uz/ru
```

---

## Monitoring Dashboards

### Sentry Dashboards

**Production Overview:**
- https://sentry.io/organizations/studentdeals/dashboard/
- Error rate, latency, throughput
- Refresh every 1 minute

**Performance:**
- https://sentry.io/organizations/studentdeals/performance/
- Transaction times, database queries
- Refresh every 1 minute

### Custom Dashboards (if using Grafana/Datadog)

- System metrics (CPU, memory, disk)
- Application metrics (RPS, errors, latency)
- Business metrics (signups, logins)

---

## On-Call Best Practices

### ✅ Do

- Acknowledge alerts promptly
- Communicate frequently
- Document everything
- Ask for help when stuck
- Write post-incident reports
- Update runbooks
- Test rollback procedures
- Keep handoff notes current

### ❌ Don't

- Ignore alerts
- Make changes without review
- Skip communication
- Work on incidents alone for > 1 hour
- Forget to close incidents
- Deploy unrelated fixes during incident
- Panic

---

## Resources

### Documentation
- [Sentry Documentation](https://docs.sentry.io/)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)

### Emergency Contacts

| Role | Name | Slack | Phone | Email |
|------|------|-------|-------|-------|
| Primary On-Call | [Current] | @handle | +XXX | email |
| Secondary On-Call | [Current] | @handle | +XXX | email |
| Engineering Lead | [Name] | @handle | +XXX | email |
| CTO | [Name] | @handle | +XXX | email |

### Status Pages

- Vercel: https://status.vercel.com
- Render: https://status.render.com
- Resend: https://status.resend.com
- GitHub: https://www.githubstatus.com

---

## Appendix: Alert Configurations

### Sentry Alert Rules JSON

```json
{
  "name": "High Error Rate",
  "conditions": [
    {
      "id": "sentry.rules.conditions.event_frequency.EventFrequencyCondition",
      "value": 100,
      "interval": "1m"
    }
  ],
  "actions": [
    {
      "id": "sentry.integrations.slack.notify_action.SlackNotifyServiceAction",
      "channel": "#incidents"
    }
  ]
}
```

### Slack Webhook Example

```bash
curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "🚨 INCIDENT: High Error Rate",
    "attachments": [{
      "color": "danger",
      "fields": [
        {"title": "Severity", "value": "P0", "short": true},
        {"title": "Service", "value": "API", "short": true}
      ]
    }]
  }'
```

---

**Last Updated:** 2025-10-11  
**Version:** 1.0  
**Owner:** Engineering Team

