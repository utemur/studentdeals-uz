# Sentry-GitHub Integration Guide

Complete guide for linking Sentry issues with GitHub commits, releases, and issues.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Commit Tracking](#commit-tracking)
- [Release Tracking](#release-tracking)
- [Issue Linking](#issue-linking)
- [Troubleshooting](#troubleshooting)

## Overview

The Sentry-GitHub integration provides:
- ✅ **Commit Tracking** - Link errors to specific commits
- ✅ **Release Tracking** - Track which release introduced an error
- ✅ **Issue Resolution** - Auto-resolve Sentry issues via commit messages
- ✅ **GitHub Issues** - Create GitHub issues from Sentry
- ✅ **Sync Comments** - Keep comments in sync between platforms
- ✅ **Suspect Commits** - Identify commits likely causing errors

## Setup

### 1. Configure Sentry CLI

Create `.sentryclirc` (already created, not in git):

```ini
[auth]
token=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

[defaults]
org=studentdeals
project=studentdeals-uz
```

### 2. Install GitHub Integration

1. Go to [Sentry Integrations](https://sentry.io/settings/studentdeals/integrations/github/)
2. Click **"Install"** or **"Configure"**
3. Authorize Sentry to access your GitHub organization
4. Select the **StudentDeals.uz** repository
5. Enable features:
   - ✅ Resolve Sentry issues via commit message
   - ✅ Link Sentry issues to GitHub issues
   - ✅ Create GitHub issues from Sentry
   - ✅ Sync comments between Sentry and GitHub

### 3. Add GitHub Secret

Add `SENTRY_AUTH_TOKEN` to GitHub repository secrets:

```bash
# Go to GitHub repository settings
https://github.com/studentdeals-uz/studentdeals/settings/secrets/actions

# Add new secret:
Name: SENTRY_AUTH_TOKEN
Value: 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
```

### 4. Configure Environment Variables

Add to your hosting providers:

**Vercel:**
```bash
SENTRY_ORG=studentdeals
SENTRY_PROJECT=studentdeals-uz
SENTRY_AUTH_TOKEN=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
```

**Render:**
```bash
SENTRY_ORG=studentdeals
SENTRY_PROJECT=studentdeals-uz
SENTRY_AUTH_TOKEN=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
```

### 5. Run Setup Script

```bash
# Run the setup script
./scripts/setup-sentry-github.sh

# Follow the prompts
```

---

## Commit Tracking

### How It Works

Sentry tracks commits associated with each release, allowing you to:
- See which commits were included in a release
- Identify "suspect commits" that likely caused an error
- Auto-resolve issues when commits include specific keywords

### Commit Message Format

To automatically resolve Sentry issues, include these keywords in your commit messages:

```bash
# ✅ Resolves issue
git commit -m "fix: authentication bug

Fixes STUDENTDEALS-123"

# ✅ Also works
git commit -m "feat: add payment method

Resolves STUDENTDEALS-456"

# ✅ Multiple issues
git commit -m "chore: dependency updates

Closes STUDENTDEALS-789, STUDENTDEALS-790"
```

### Supported Keywords

| Keyword | Description |
|---------|-------------|
| `Fixes STUDENTDEALS-XXX` | Marks issue as resolved |
| `Resolves STUDENTDEALS-XXX` | Marks issue as resolved |
| `Closes STUDENTDEALS-XXX` | Marks issue as resolved |

**Finding Issue IDs:**
- Go to Sentry issue page
- Look for "Short ID" in the top right
- Example: `STUDENTDEALS-123`

### Example Workflow

```bash
# 1. Find error in Sentry
# https://sentry.io/organizations/studentdeals/issues/STUDENTDEALS-123/

# 2. Fix the bug
vim apps/api/src/auth/auth.service.ts

# 3. Commit with issue reference
git commit -m "fix(auth): resolve token expiration bug

The JWT token was not being properly refreshed, causing
users to be logged out prematurely.

Fixes STUDENTDEALS-123"

# 4. Push to main
git push origin main

# 5. GitHub Action creates Sentry release
# 6. Sentry automatically resolves issue STUDENTDEALS-123
# 7. Issue marked as "Resolved in next release"
```

---

## Release Tracking

### How It Works

Sentry releases are automatically created on every deployment to `main`:
- Release version: Git commit SHA
- Associated commits: All commits since last release
- Deployment tracking: Production/Staging environments
- Source maps: Uploaded for stack trace mapping

### Automatic Release Creation

The `.github/workflows/sentry-release.yml` workflow automatically:

1. **Creates Release** - On every push to `main`
2. **Associates Commits** - Links all commits to release
3. **Tracks Deployments** - Marks when/where deployed
4. **Comments on Commits** - Adds Sentry release link

### Manual Release Creation

```bash
# Create release
sentry-cli releases new <version>

# Associate commits
sentry-cli releases set-commits <version> --auto

# Finalize release
sentry-cli releases finalize <version>

# Track deployment
sentry-cli releases deploys <version> new -e production
```

### Viewing Releases

**Sentry Dashboard:**
- https://sentry.io/organizations/studentdeals/releases/
- View all releases, commits, and errors introduced

**Per Issue:**
- Go to any Sentry issue
- See "First seen in release" and "Last seen in release"
- View suspect commits

### Release Best Practices

1. **Semantic Versioning** - Use meaningful version numbers
2. **Associate Commits** - Always link commits to releases
3. **Track Deployments** - Mark when deployed to each environment
4. **Upload Source Maps** - Essential for readable stack traces
5. **Set Release Names** - Use consistent naming (SHA, tag, etc.)

---

## Issue Linking

### Creating GitHub Issues from Sentry

**From Sentry Dashboard:**

1. Go to Sentry issue page
2. Click **"Create Issue"** in the sidebar
3. Select **"GitHub"**
4. Fill in issue details
5. Click **"Create"**

Result:
- GitHub issue created automatically
- Linked to Sentry issue
- Comments synced between platforms

### Linking Existing GitHub Issues

**From Sentry:**

1. Go to Sentry issue page
2. Click **"Link Issue"**
3. Select **"GitHub"**
4. Enter GitHub issue number
5. Click **"Link"**

**From GitHub:**

Add Sentry issue URL in GitHub issue description:
```markdown
## Related Sentry Issue

https://sentry.io/organizations/studentdeals/issues/STUDENTDEALS-123/
```

### Comment Syncing

When linked:
- ✅ Comments on Sentry issue → appear on GitHub issue
- ✅ Comments on GitHub issue → appear on Sentry issue
- ✅ Closing GitHub issue → marks Sentry issue as resolved
- ✅ Reopening GitHub issue → reopens Sentry issue

---

## Suspect Commits

### How Sentry Identifies Suspect Commits

Sentry uses heuristics to identify commits likely causing an error:

1. **New Error** - Error first appeared after this commit
2. **Stack Trace Match** - Commit modified files in stack trace
3. **Frequency Spike** - Error frequency increased after commit
4. **Developer Activity** - Commits by developer during error timeframe

### Viewing Suspect Commits

**In Sentry Issue:**
1. Go to issue page
2. Scroll to **"Suspect Commits"** section
3. View commits with reason for suspicion
4. Click commit to view diff

**In Sentry Releases:**
1. Go to Releases page
2. Select a release
3. View **"New Issues"** introduced in this release
4. Each issue shows suspect commits

### Using Suspect Commits

```bash
# 1. View suspect commits in Sentry
# 2. Review the diff for each commit
# 3. Identify the problematic code
# 4. Fix the bug
# 5. Commit with "Fixes STUDENTDEALS-XXX"
# 6. Deploy
# 7. Verify issue is resolved
```

---

## GitHub Actions Integration

### Workflow: Sentry Release

Located: `.github/workflows/sentry-release.yml`

**Triggers:**
- Push to `main` branch
- Release published

**Actions:**
1. Create Sentry release (commit SHA)
2. Associate commits with release
3. Track deployment to environment
4. Comment on commit with Sentry link

**Example Output:**
```
✅ Sentry release created: a1b2c3d4e5f6
✅ Deployment tracked in Sentry
📊 Sentry Release Created
   View in Sentry: https://sentry.io/...
```

### Workflow: Next.js Build (Web)

Source maps are automatically uploaded during production builds via `next.config.js`:

```javascript
// next.config.js
module.exports = withSentryConfig(
  nextConfig,
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: !process.env.CI,
  }
);
```

### Workflow: NestJS Build (API)

Source maps are generated during build and can be uploaded manually:

```bash
# Build API
pnpm --filter api run build

# Upload source maps (if needed)
sentry-cli releases files <version> upload-sourcemaps \
  apps/api/dist \
  --url-prefix '~/dist'
```

---

## Environment Variables

### Required for CI/CD

| Variable | Description | Where to Add |
|----------|-------------|--------------|
| `SENTRY_AUTH_TOKEN` | Sentry API token | GitHub Secrets |
| `SENTRY_ORG` | Sentry organization slug | Vercel, Render, GitHub |
| `SENTRY_PROJECT` | Sentry project slug | Vercel, Render, GitHub |
| `SENTRY_DSN` | Sentry DSN (server-side) | Render |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (client-side) | Vercel |

### Adding to GitHub Secrets

```bash
# Go to repository settings
https://github.com/studentdeals-uz/studentdeals/settings/secrets/actions

# Add secrets:
SENTRY_AUTH_TOKEN=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
SENTRY_ORG=studentdeals
SENTRY_PROJECT=studentdeals-uz
```

### Adding to Vercel

```bash
# Via Vercel CLI
vercel env add SENTRY_AUTH_TOKEN production

# Or via dashboard:
# https://vercel.com/studentdeals/web/settings/environment-variables
```

### Adding to Render

```bash
# Via dashboard:
# https://dashboard.render.com/web/srv-XXX/env
# Add environment variables
```

---

## Troubleshooting

### Issue: Commits not showing in Sentry

**Problem:** Commits are not associated with Sentry releases

**Solution:**
1. Verify GitHub integration is installed
2. Check `SENTRY_AUTH_TOKEN` in GitHub Secrets
3. Verify `.github/workflows/sentry-release.yml` is running
4. Check GitHub Actions logs for errors
5. Manually associate commits:
   ```bash
   sentry-cli releases set-commits <version> --auto
   ```

### Issue: "Fixes STUDENTDEALS-XXX" not resolving issues

**Problem:** Commit messages don't resolve Sentry issues

**Solution:**
1. Verify commit message format (case-sensitive)
2. Check that issue ID is correct (STUDENTDEALS-XXX)
3. Ensure GitHub integration has "Resolve via commit" enabled
4. Wait a few minutes for processing
5. Check Sentry issue activity log

### Issue: Source maps not uploading

**Problem:** Stack traces show minified code

**Solution:**
1. Verify `SENTRY_AUTH_TOKEN` is set
2. Check build logs for upload errors
3. Verify `next.config.js` Sentry config
4. Manually upload source maps:
   ```bash
   sentry-cli releases files <version> upload-sourcemaps .next
   ```

### Issue: Releases not appearing

**Problem:** No releases in Sentry dashboard

**Solution:**
1. Check GitHub Actions workflow status
2. Verify `SENTRY_AUTH_TOKEN` in GitHub Secrets
3. Check workflow logs for errors
4. Manually create release:
   ```bash
   sentry-cli releases new <version>
   ```

### Issue: Suspect commits not accurate

**Problem:** Wrong commits shown as suspects

**Solution:**
- Suspect commits are heuristic-based, not 100% accurate
- Review all recent commits, not just suspects
- Use error stack trace to identify actual cause
- Improve by always associating commits with releases

---

## Best Practices

### ✅ Do

- **Always** include "Fixes STUDENTDEALS-XXX" when fixing bugs
- **Always** create releases for production deployments
- **Always** associate commits with releases
- **Always** upload source maps
- Write descriptive commit messages
- Link Sentry issues to GitHub issues for tracking
- Review suspect commits when investigating errors
- Use consistent release naming (commit SHA)

### ❌ Don't

- Skip commit associations
- Forget to upload source maps
- Use vague commit messages
- Create releases without commits
- Ignore suspect commit suggestions
- Deploy without tracking in Sentry

---

## Commands Reference

### Sentry CLI Commands

```bash
# Install
npm install -g @sentry/cli

# Login
sentry-cli login

# Test connection
sentry-cli info

# Create release
sentry-cli releases new <version>

# Associate commits
sentry-cli releases set-commits <version> --auto

# Upload source maps
sentry-cli releases files <version> upload-sourcemaps <path>

# Finalize release
sentry-cli releases finalize <version>

# Track deployment
sentry-cli releases deploys <version> new -e <environment>

# List releases
sentry-cli releases list

# Delete release
sentry-cli releases delete <version>
```

### Git Commit Examples

```bash
# Fix with Sentry reference
git commit -m "fix(auth): resolve token expiration

Fixes STUDENTDEALS-123"

# Feature with Sentry reference
git commit -m "feat(payments): add stripe integration

Closes STUDENTDEALS-456"

# Multiple issues
git commit -m "chore: dependency updates

Resolves STUDENTDEALS-789, STUDENTDEALS-790"
```

---

## Resources

### Documentation
- [Sentry GitHub Integration](https://docs.sentry.io/product/integrations/github/)
- [Sentry Releases](https://docs.sentry.io/product/releases/)
- [Sentry CLI](https://docs.sentry.io/product/cli/)
- [Suspect Commits](https://docs.sentry.io/product/issues/suspect-commits/)

### Dashboards
- [Sentry Organization](https://sentry.io/organizations/studentdeals/)
- [Releases](https://sentry.io/organizations/studentdeals/releases/)
- [Issues](https://sentry.io/organizations/studentdeals/issues/)
- [Performance](https://sentry.io/organizations/studentdeals/performance/)

### Internal Docs
- [docs/INCIDENTS.md](./INCIDENTS.md) - On-call procedures
- [docs/SENTRY_CONFIGURATION.md](./SENTRY_CONFIGURATION.md) - Sentry setup
- [docs/SENTRY_TESTING.md](./SENTRY_TESTING.md) - Testing Sentry

---

**Last Updated:** 2025-10-11  
**Version:** 1.0  
**Owner:** Engineering Team

