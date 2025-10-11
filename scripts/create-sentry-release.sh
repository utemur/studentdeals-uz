#!/bin/bash

# Sentry Release Creation Script
# This script creates a Sentry release from a git tag or commit

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🚀 Sentry Release Creation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if sentry-cli is installed
if ! command -v sentry-cli &> /dev/null; then
    echo -e "${RED}✗ sentry-cli not found!${NC}"
    echo ""
    echo "Install with:"
    echo "  npm install -g @sentry/cli"
    echo ""
    exit 1
fi

# Check if .sentryclirc exists
if [ ! -f ".sentryclirc" ]; then
    echo -e "${RED}✗ .sentryclirc not found!${NC}"
    echo ""
    echo "Please create .sentryclirc with your Sentry auth token."
    echo "See: docs/SENTRY_GITHUB_INTEGRATION.md"
    echo ""
    exit 1
fi

# Get Sentry organization and project
SENTRY_ORG=$(grep -A1 "\[defaults\]" .sentryclirc | grep "org" | cut -d'=' -f2 | tr -d ' ')
SENTRY_PROJECT=$(grep -A2 "\[defaults\]" .sentryclirc | grep "project" | cut -d'=' -f2 | tr -d ' ')

if [ -z "$SENTRY_ORG" ] || [ -z "$SENTRY_PROJECT" ]; then
    echo -e "${RED}✗ Could not read Sentry org/project from .sentryclirc${NC}"
    exit 1
fi

echo -e "${BLUE}Organization:${NC} $SENTRY_ORG"
echo -e "${BLUE}Project:${NC} $SENTRY_PROJECT"
echo ""

# Determine release version
VERSION=""

# Option 1: Use provided argument
if [ -n "$1" ]; then
    VERSION="$1"
    echo -e "${BLUE}Using provided version:${NC} $VERSION"
# Option 2: Use latest git tag
elif git describe --tags --exact-match HEAD &> /dev/null; then
    VERSION=$(git describe --tags --exact-match HEAD)
    echo -e "${BLUE}Using git tag:${NC} $VERSION"
# Option 3: Use current commit SHA
else
    VERSION=$(git rev-parse HEAD)
    echo -e "${BLUE}Using commit SHA:${NC} $VERSION"
fi

echo ""

# Confirm with user
echo -e "${YELLOW}Create Sentry release: ${VERSION}?${NC}"
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Creating Sentry Release"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Step 1: Create release
echo -e "${BLUE}1/3${NC} Creating release..."
if sentry-cli releases new "$VERSION" --org "$SENTRY_ORG" --project "$SENTRY_PROJECT"; then
    echo -e "${GREEN}✓ Release created${NC}"
else
    echo -e "${RED}✗ Failed to create release${NC}"
    exit 1
fi
echo ""

# Step 2: Associate commits
echo -e "${BLUE}2/3${NC} Associating commits..."
if sentry-cli releases set-commits "$VERSION" --auto --org "$SENTRY_ORG" --project "$SENTRY_PROJECT"; then
    echo -e "${GREEN}✓ Commits associated${NC}"
else
    echo -e "${YELLOW}⚠ Warning: Failed to associate commits${NC}"
    echo "Continuing anyway..."
fi
echo ""

# Step 3: Finalize release
echo -e "${BLUE}3/3${NC} Finalizing release..."
if sentry-cli releases finalize "$VERSION" --org "$SENTRY_ORG" --project "$SENTRY_PROJECT"; then
    echo -e "${GREEN}✓ Release finalized${NC}"
else
    echo -e "${RED}✗ Failed to finalize release${NC}"
    exit 1
fi
echo ""

# Optional: Upload source maps for web app
if [ -d "apps/web/.next" ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Uploading Source Maps (Web)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    echo -e "${BLUE}Uploading Next.js source maps...${NC}"
    if sentry-cli releases files "$VERSION" upload-sourcemaps \
        apps/web/.next \
        --url-prefix '~/_next' \
        --org "$SENTRY_ORG" \
        --project "$SENTRY_PROJECT"; then
        echo -e "${GREEN}✓ Source maps uploaded${NC}"
    else
        echo -e "${YELLOW}⚠ Warning: Failed to upload source maps${NC}"
    fi
    echo ""
fi

# Optional: Upload source maps for API
if [ -d "apps/api/dist" ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  Uploading Source Maps (API)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    echo -e "${BLUE}Uploading API source maps...${NC}"
    if sentry-cli releases files "$VERSION" upload-sourcemaps \
        apps/api/dist \
        --url-prefix '~/dist' \
        --org "$SENTRY_ORG" \
        --project "$SENTRY_PROJECT"; then
        echo -e "${GREEN}✓ Source maps uploaded${NC}"
    else
        echo -e "${YELLOW}⚠ Warning: Failed to upload source maps${NC}"
    fi
    echo ""
fi

# Output release URL
RELEASE_URL="https://sentry.io/organizations/$SENTRY_ORG/releases/$VERSION/?project=$SENTRY_PROJECT"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Release Created Successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}Release:${NC} $VERSION"
echo -e "${GREEN}URL:${NC} $RELEASE_URL"
echo ""

# Copy URL to clipboard (macOS)
if command -v pbcopy &> /dev/null; then
    echo "$RELEASE_URL" | pbcopy
    echo -e "${BLUE}📋 URL copied to clipboard${NC}"
    echo ""
fi

# Open in browser (optional)
echo -e "${YELLOW}Open release in browser?${NC}"
read -p "(y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "$RELEASE_URL"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$RELEASE_URL"
    else
        echo "Please open manually:"
        echo "$RELEASE_URL"
    fi
fi

echo ""
echo -e "${GREEN}Done! 🎉${NC}"
echo ""

