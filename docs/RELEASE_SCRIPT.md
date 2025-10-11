# Release Script Guide

Guide for creating Sentry releases using the release script.

## Overview

The release script automates Sentry release creation, including:
- ✅ Creating release in Sentry
- ✅ Associating git commits
- ✅ Finalizing release
- ✅ Uploading source maps
- ✅ Outputting release URL

## Quick Start

```bash
# Use current commit SHA
pnpm release

# Use specific version
pnpm release v1.0.0

# Use latest git tag
pnpm release:tag
```

## Usage

### Option 1: Current Commit SHA (Default)

```bash
pnpm release
```

This will:
1. Use current git commit SHA as version
2. Create Sentry release
3. Associate all commits since last release
4. Finalize release
5. Upload source maps (if available)
6. Output release URL

**Example:**
```bash
$ pnpm release

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🚀 Sentry Release Creation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Organization: studentdeals
Project: studentdeals-uz

Using commit SHA: a1b2c3d4e5f6...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Creating Sentry Release
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1/3 Creating release...
✓ Release created

2/3 Associating commits...
✓ Commits associated

3/3 Finalizing release...
✓ Release finalized

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Release Created Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Release: a1b2c3d4e5f6...
URL: https://sentry.io/organizations/studentdeals/releases/a1b2c3d4e5f6...

📝 Release info saved to .sentry-release

Done! 🎉
```

---

### Option 2: Specific Version

```bash
pnpm release v1.0.0
pnpm release 2024.01.15
pnpm release production-123
```

Use this when:
- Deploying a tagged release
- Using semantic versioning
- Using date-based versions
- Custom version naming

**Example:**
```bash
$ pnpm release v1.0.0

Organization: studentdeals
Project: studentdeals-uz

Using provided version: v1.0.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Creating Sentry Release
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1/3 Creating release...
✓ Release created

2/3 Associating commits...
✓ Commits associated

3/3 Finalizing release...
✓ Release finalized

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Release Created Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Release: v1.0.0
URL: https://sentry.io/organizations/studentdeals/releases/v1.0.0/

Done! 🎉
```

---

### Option 3: Latest Git Tag

```bash
pnpm release:tag
```

Use this when:
- You've already tagged a release in git
- Following git-tag-based versioning
- Deploying from a tagged commit

**Requirements:**
- HEAD must have a git tag
- Tag must be annotated or lightweight

**Example:**
```bash
# First, create and push a tag
$ git tag v1.0.0
$ git push --tags

# Then create Sentry release
$ pnpm release:tag

Organization: studentdeals
Project: studentdeals-uz

Using git tag: v1.0.0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Creating Sentry Release
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1/3 Creating release...
✓ Release created

2/3 Associating commits...
✓ Commits associated

3/3 Finalizing release...
✓ Release finalized

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Release Created Successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Release: v1.0.0
URL: https://sentry.io/organizations/studentdeals/releases/v1.0.0/

Done! 🎉
```

---

## What Happens

### Step 1: Create Release

```bash
sentry-cli releases new <version>
```

Creates a new release in Sentry with the specified version.

### Step 2: Associate Commits

```bash
sentry-cli releases set-commits <version> --auto
```

Associates all git commits since the last release with this release. This enables:
- Suspect commit identification
- Commit-based error tracking
- Release comparison

### Step 3: Finalize Release

```bash
sentry-cli releases finalize <version>
```

Marks the release as complete and ready for deployment tracking.

### Step 4: Upload Source Maps (Optional)

If build artifacts exist:

**Web App (Next.js):**
```bash
sentry-cli releases files <version> upload-sourcemaps \
  apps/web/.next \
  --url-prefix '~/_next'
```

**API (NestJS):**
```bash
sentry-cli releases files <version> upload-sourcemaps \
  apps/api/dist \
  --url-prefix '~/dist'
```

Source maps enable readable stack traces in Sentry.

### Step 5: Output Release Info

Creates `.sentry-release` file with release information:

```json
{
  "version": "v1.0.0",
  "url": "https://sentry.io/organizations/studentdeals/releases/v1.0.0/",
  "org": "studentdeals",
  "project": "studentdeals-uz",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

This file can be used by CI/CD pipelines.

---

## Prerequisites

### 1. Sentry CLI

Install globally:
```bash
npm install -g @sentry/cli
```

Verify installation:
```bash
sentry-cli --version
```

### 2. Sentry Configuration

Create `.sentryclirc` in project root:

```ini
[auth]
token=sntryu_your_token_here

[defaults]
org=studentdeals
project=studentdeals-uz
```

**Note:** `.sentryclirc` is in `.gitignore` for security.

### 3. Git Repository

Ensure you're in a git repository:
```bash
git status
```

---

## Integration with CI/CD

### GitHub Actions

```yaml
name: Deploy and Create Release

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # Need full history for commits
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
      
      - name: Deploy
        run: # Your deployment script
      
      - name: Create Sentry Release
        env:
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
        run: pnpm release
      
      - name: Read release info
        id: release
        run: |
          RELEASE_VERSION=$(jq -r '.version' .sentry-release)
          RELEASE_URL=$(jq -r '.url' .sentry-release)
          echo "version=$RELEASE_VERSION" >> $GITHUB_OUTPUT
          echo "url=$RELEASE_URL" >> $GITHUB_OUTPUT
      
      - name: Comment on commit
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.repos.createCommitComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              commit_sha: context.sha,
              body: `📊 Sentry Release: ${{ steps.release.outputs.version }}\n\n${{ steps.release.outputs.url }}`
            });
```

### Vercel

Add to `vercel.json` or deployment script:

```json
{
  "buildCommand": "pnpm build && pnpm release",
  "env": {
    "SENTRY_AUTH_TOKEN": "@sentry-auth-token"
  }
}
```

### Render

Add to `render.yaml`:

```yaml
services:
  - type: web
    buildCommand: pnpm build && pnpm release
    envVars:
      - key: SENTRY_AUTH_TOKEN
        sync: false
```

---

## Versioning Strategies

### Semantic Versioning

```bash
# Major release
pnpm release v2.0.0

# Minor release
pnpm release v1.1.0

# Patch release
pnpm release v1.0.1
```

### Date-Based Versioning

```bash
pnpm release 2025.01.15
pnpm release 2025.01.15-hotfix
```

### Commit SHA (Default)

```bash
# Uses: a1b2c3d4e5f6...
pnpm release
```

### Git Tags

```bash
git tag v1.0.0
git push --tags
pnpm release:tag
```

---

## Troubleshooting

### Error: sentry-cli not found

**Solution:**
```bash
npm install -g @sentry/cli
```

### Error: .sentryclirc not found

**Solution:**
Create `.sentryclirc`:
```bash
cp .sentryclirc.example .sentryclirc
# Edit and add your auth token
```

### Error: Failed to associate commits

**Problem:** Git repository not properly configured

**Solution:**
```bash
# Ensure you have git history
git fetch --unshallow

# Ensure you're in a git repo
git status
```

### Error: No git tag found on HEAD

**Solution:**
```bash
# Create a tag first
git tag v1.0.0

# Or use a different method
pnpm release v1.0.0  # Provide version explicitly
pnpm release          # Use commit SHA
```

### Warning: Failed to upload source maps

**Problem:** Build artifacts not found

**Solution:**
```bash
# Build first
pnpm build

# Then create release
pnpm release
```

---

## Best Practices

### 1. Build Before Release

```bash
# ✅ Good
pnpm build
pnpm release

# ❌ Bad
pnpm release  # Without building first
```

### 2. Use Meaningful Versions

```bash
# ✅ Good
pnpm release v1.0.0
pnpm release 2025.01.15

# ❌ Bad
pnpm release test
pnpm release asdf
```

### 3. Tag Releases in Git

```bash
# ✅ Good
git tag v1.0.0
git push --tags
pnpm release:tag

# Document release in git history
```

### 4. Verify Release in Sentry

After creating a release:
1. Open the release URL
2. Verify commits are associated
3. Check source maps are uploaded
4. Confirm release is finalized

### 5. Use in CI/CD

Automate release creation in your deployment pipeline:
- Deploy → Create Release → Track Deployments

---

## Scripts

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm release` | Create release with commit SHA |
| `pnpm release <version>` | Create release with specific version |
| `pnpm release:tag` | Create release from git tag |

### Script Files

| File | Description |
|------|-------------|
| `scripts/release.js` | Node.js release script (primary) |
| `scripts/create-sentry-release.sh` | Bash release script (alternative) |

### Output Files

| File | Description |
|------|-------------|
| `.sentry-release` | Release info (JSON) for CI/CD |

---

## Examples

### Example 1: Production Deploy

```bash
# 1. Create git tag
git tag v1.0.0
git commit -m "chore: release v1.0.0"
git push --tags

# 2. Build application
pnpm build

# 3. Deploy
# (Your deployment commands)

# 4. Create Sentry release
pnpm release:tag

# 5. Output:
# ✅ Release Created Successfully!
# Release: v1.0.0
# URL: https://sentry.io/organizations/studentdeals/releases/v1.0.0/
```

### Example 2: Hotfix Deploy

```bash
# 1. Fix bug and commit
git commit -m "fix: critical auth bug

Fixes STUDENTDEALS-123"

# 2. Build
pnpm build

# 3. Create release with commit SHA
pnpm release

# 4. Deploy
# (Your deployment commands)
```

### Example 3: Scheduled Release

```bash
# 1. Use date-based version
DATE=$(date +%Y.%m.%d)
VERSION="$DATE-$(git rev-parse --short HEAD)"

# 2. Build
pnpm build

# 3. Create release
pnpm release "$VERSION"

# 4. Output:
# Release: 2025.01.15-a1b2c3d
```

---

## Advanced Usage

### Custom Source Map Paths

Edit `scripts/release.js`:

```javascript
// Custom paths
const customPaths = [
  { dir: 'apps/admin/.next', prefix: '~/_next' },
  { dir: 'apps/mobile/dist', prefix: '~/mobile' },
];

for (const { dir, prefix } of customPaths) {
  if (fs.existsSync(dir)) {
    exec(`sentry-cli releases files "${version}" upload-sourcemaps ${dir} --url-prefix '${prefix}'`);
  }
}
```

### Multiple Projects

Create releases for multiple Sentry projects:

```bash
# Project 1: Web
SENTRY_PROJECT=web pnpm release

# Project 2: API
SENTRY_PROJECT=api pnpm release

# Project 3: Mobile
SENTRY_PROJECT=mobile pnpm release
```

### Custom Commit Range

```bash
# Associate specific commit range
sentry-cli releases set-commits <version> \
  --commit "studentdeals/studentdeals@<start-sha>..<end-sha>"
```

---

## Resources

- [Sentry Releases Documentation](https://docs.sentry.io/product/releases/)
- [Sentry CLI Documentation](https://docs.sentry.io/product/cli/)
- [Source Maps Guide](https://docs.sentry.io/platforms/javascript/sourcemaps/)

---

**Last Updated:** 2025-10-11  
**Version:** 1.0  
**Owner:** Engineering Team

