# GitHub Secrets Configuration

This document outlines the required GitHub repository secrets for CI/CD workflows.

## Required Secrets

### 1. Sentry Configuration

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `SENTRY_AUTH_TOKEN` | Sentry authentication token | `sntrys_...` |
| `SENTRY_ORG` | Sentry organization slug | `studentdeals` |
| `SENTRY_PROJECT` | Sentry project slug | `studentdeals-uz` |

**How to get Sentry secrets:**
1. Go to [Sentry.io](https://sentry.io) → Settings → Auth Tokens
2. Create a new token with `project:releases` scope
3. Copy the token value
4. Note your organization slug from the URL: `https://sentry.io/organizations/{org-slug}/`

### 2. Environment Variables

| Secret Name | Description | Example Value |
|-------------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | API base URL for frontend | `https://studentdeals-api.onrender.com` |
| `NEXT_PUBLIC_APP_URL` | Frontend app URL | `https://studentdeals.uz` |

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

## Workflow Behavior

### Sentry Release Workflow

- **Runs on:** `main` branch pushes and releases
- **Skips if:** Any of `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, or `SENTRY_PROJECT` are missing
- **Fallback:** Shows "Skip Sentry Release" job with explanation

### Build Web Workflow

- **Uses secrets:** `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`
- **Fallback values:** 
  - `NEXT_PUBLIC_API_URL`: `https://studentdeals-api.onrender.com`
  - `NEXT_PUBLIC_APP_URL`: `https://studentdeals.uz`

### E2E Tests Workflow

- **Runs on:** `main` branch pushes only
- **Can be enabled:** Set `RUN_E2E=true` environment variable
- **Currently:** Temporarily disabled by default

## Verification

After adding secrets, verify they work by:

1. **Check workflow runs:** Go to Actions tab in GitHub
2. **Look for green checkmarks:** All workflows should pass
3. **Check logs:** Click on failed jobs to see error messages

## Troubleshooting

### Common Issues

1. **"Sentry release failed"**
   - Check if `SENTRY_AUTH_TOKEN` is valid
   - Verify `SENTRY_ORG` and `SENTRY_PROJECT` match your Sentry setup

2. **"Build failed with environment variables"**
   - Ensure `NEXT_PUBLIC_API_URL` points to your deployed API
   - Check if the API is accessible from GitHub Actions

3. **"E2E tests skipped"**
   - This is expected behavior (temporarily disabled)
   - To enable: Set `RUN_E2E=true` in repository settings

### Secret Validation

You can test if secrets are properly configured by checking the workflow logs:

```bash
# Check if Sentry secrets are available
echo "SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN != '' }}"
echo "SENTRY_ORG: ${{ secrets.SENTRY_ORG != '' }}"
echo "SENTRY_PROJECT: ${{ secrets.SENTRY_PROJECT != '' }}"
```

## Security Notes

- **Never commit secrets** to the repository
- **Use repository secrets** for sensitive data
- **Rotate tokens regularly** for security
- **Limit token scopes** to minimum required permissions

## Environment-Specific Configuration

### Development
- No secrets required (uses localhost URLs)

### Staging
- Use staging API URL: `https://api-staging.studentdeals.uz`
- Use staging app URL: `https://staging.studentdeals.uz`

### Production
- Use production API URL: `https://studentdeals-api.onrender.com`
- Use production app URL: `https://studentdeals.uz`
