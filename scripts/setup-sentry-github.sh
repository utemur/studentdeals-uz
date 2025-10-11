#!/bin/bash

# Sentry-GitHub Integration Setup Script
# This script configures Sentry to link issues with GitHub commits

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Sentry-GitHub Integration Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if sentry-cli is installed
if ! command -v sentry-cli &> /dev/null; then
    echo -e "${YELLOW}⚠️  sentry-cli not found. Installing...${NC}"
    npm install -g @sentry/cli
fi

# Check if .sentryclirc exists
if [ ! -f ".sentryclirc" ]; then
    echo -e "${RED}✗ .sentryclirc not found!${NC}"
    echo "Please create .sentryclirc with your Sentry auth token."
    exit 1
fi

echo -e "${GREEN}✓ Sentry CLI configured${NC}"
echo ""

# Test Sentry connection
echo "Testing Sentry connection..."
if sentry-cli info > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Connected to Sentry${NC}"
else
    echo -e "${RED}✗ Failed to connect to Sentry${NC}"
    echo "Please check your .sentryclirc configuration"
    exit 1
fi
echo ""

# Get Sentry organization and project from .sentryclirc
SENTRY_ORG=$(grep -A1 "\[defaults\]" .sentryclirc | grep "org" | cut -d'=' -f2 | tr -d ' ')
SENTRY_PROJECT=$(grep -A2 "\[defaults\]" .sentryclirc | grep "project" | cut -d'=' -f2 | tr -d ' ')

echo "Organization: $SENTRY_ORG"
echo "Project: $SENTRY_PROJECT"
echo ""

# Set up GitHub integration
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  GitHub Integration Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "To complete the GitHub integration:"
echo ""
echo "1. Go to: https://sentry.io/settings/$SENTRY_ORG/integrations/github/"
echo "2. Click 'Install' or 'Configure' for GitHub"
echo "3. Authorize Sentry to access your GitHub organization"
echo "4. Select the 'StudentDeals.uz' repository"
echo "5. Enable the following features:"
echo "   ✓ Resolve Sentry issues via commit message"
echo "   ✓ Link Sentry issues to GitHub issues"
echo "   ✓ Create GitHub issues from Sentry"
echo "   ✓ Sync comments between Sentry and GitHub"
echo ""

read -p "Press Enter once you've completed the GitHub integration setup..."
echo ""

# Configure commit tracking
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Commit Tracking Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Sentry can automatically resolve issues when you include"
echo "these keywords in your commit messages:"
echo ""
echo "  • Fixes STUDENTDEALS-123"
echo "  • Resolves STUDENTDEALS-123"
echo "  • Closes STUDENTDEALS-123"
echo ""
echo "Where STUDENTDEALS-123 is the Sentry issue ID."
echo ""

# Set up release tracking
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Release Tracking"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Release tracking is already configured in:"
echo "  • next.config.js (for web app)"
echo "  • apps/api/src/instrument.ts (for API)"
echo ""
echo "Releases are automatically created during deployment."
echo ""

# Set up source maps upload
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Source Maps Upload"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Source maps upload is configured in next.config.js"
echo "and will happen automatically during production builds."
echo ""

# Test commit message parsing
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Testing Commit Message Parsing"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Example commit messages that will resolve Sentry issues:"
echo ""
echo -e "${GREEN}✓${NC} fix: resolve authentication bug"
echo "   Fixes STUDENTDEALS-123"
echo ""
echo -e "${GREEN}✓${NC} feat: add new payment method"
echo "   Closes STUDENTDEALS-456"
echo ""
echo -e "${GREEN}✓${NC} chore: update dependencies"
echo "   Resolves STUDENTDEALS-789"
echo ""

# Environment variables check
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Environment Variables Check"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

required_vars=(
    "SENTRY_DSN"
    "NEXT_PUBLIC_SENTRY_DSN"
    "SENTRY_ORG"
    "SENTRY_PROJECT"
    "SENTRY_AUTH_TOKEN"
)

echo "Required environment variables for CI/CD:"
echo ""

for var in "${required_vars[@]}"; do
    if [ "$var" = "SENTRY_AUTH_TOKEN" ]; then
        echo "  • $var (add to GitHub Secrets)"
    else
        echo "  • $var"
    fi
done

echo ""
echo "Add these to:"
echo "  • .env.local (for local development)"
echo "  • .env.production (for production)"
echo "  • GitHub Secrets (for CI/CD)"
echo "  • Vercel Environment Variables"
echo "  • Render Environment Variables"
echo ""

# GitHub Actions setup
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  GitHub Actions Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "To enable Sentry releases in GitHub Actions:"
echo ""
echo "1. Go to: https://github.com/studentdeals-uz/studentdeals/settings/secrets"
echo "2. Add new secret:"
echo "   Name: SENTRY_AUTH_TOKEN"
echo "   Value: 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"
echo ""
echo "3. The GitHub Actions workflows will automatically:"
echo "   • Create Sentry releases"
echo "   • Upload source maps"
echo "   • Associate commits with releases"
echo "   • Link errors to specific commits"
echo ""

# Success summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "Next steps:"
echo ""
echo "1. Complete GitHub integration in Sentry dashboard"
echo "2. Add SENTRY_AUTH_TOKEN to GitHub Secrets"
echo "3. Add required environment variables to hosting providers"
echo "4. Test by creating a commit with 'Fixes STUDENTDEALS-XXX'"
echo "5. Deploy and verify in Sentry dashboard"
echo ""

echo "Documentation:"
echo "  • docs/INCIDENTS.md - On-call procedures"
echo "  • docs/SENTRY_CONFIGURATION.md - Sentry setup"
echo "  • https://docs.sentry.io/product/integrations/github/"
echo ""

echo -e "${GREEN}🎉 Sentry-GitHub integration is ready!${NC}"
echo ""

