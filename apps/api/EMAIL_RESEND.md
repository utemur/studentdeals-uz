# 📧 Email via Resend

## 🎯 Overview

StudentDeals.uz использует [Resend](https://resend.com) для отправки транзакционных email:
- Email verification (подтверждение регистрации)
- Password reset (восстановление пароля) - coming soon
- Notifications (уведомления) - coming soon

## 🔧 Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RESEND_API_KEY` | ✅ Yes (prod) | `dev_key` | Resend API key (get from resend.com) |
| `EMAIL_FROM` | ❌ No | `StudentDeals <noreply@studentdeals.uz>` | From email address |
| `APP_URL` | ❌ No | `http://localhost:3000` | Application URL for links |
| `EMAIL_TOKEN_TTL_HOURS` | ❌ No | `24` | Verification token TTL in hours |

### Example Configuration

**Development (without Resend):**
```bash
# apps/api/.env
# RESEND_API_KEY not set → mock mode
EMAIL_FROM="StudentDeals <noreply@studentdeals.uz>"
APP_URL="http://localhost:3000"
EMAIL_TOKEN_TTL_HOURS=24
```

**Production (with Resend):**
```bash
# Render Environment Variables
RESEND_API_KEY=re_123abc...
EMAIL_FROM="StudentDeals <noreply@studentdeals.uz>"
APP_URL="https://studentdeals.uz"
EMAIL_TOKEN_TTL_HOURS=24
```

## 🚀 Getting Started with Resend

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for free account
3. Verify your email

### 2. Add Domain

1. Go to **Domains** → **Add Domain**
2. Enter your domain: `studentdeals.uz`
3. Add DNS records to your domain provider:

```
Type: TXT
Name: @
Value: resend-verify=abc123...

Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
```

4. Wait for verification (usually 5-10 minutes)

### 3. Generate API Key

1. Go to **API Keys** → **Create API Key**
2. Name: `StudentDeals Production`
3. Permission: **Sending access**
4. Copy the API key (starts with `re_`)

### 4. Add to Render

1. Open your service in [Render Dashboard](https://dashboard.render.com)
2. Go to **Environment** → **Environment Variables**
3. Add:
   ```
   RESEND_API_KEY=re_abc123...
   EMAIL_FROM=StudentDeals <noreply@studentdeals.uz>
   APP_URL=https://studentdeals.uz
   ```

## 📨 Email Templates

### Verification Email

**Subject:** `Подтверждение регистрации — StudentDeals`

**Content:**
- Beautiful HTML template with gradient header
- Call-to-action button: "✉️ Подтвердить email"
- Plain text link as fallback
- 24-hour expiry notice
- Plain text version for email clients

**Example:**
```
┌─────────────────────────────────┐
│  🎓 Student Deals Uzbekistan    │  ← Blue gradient header
├─────────────────────────────────┤
│                                 │
│  Подтверждение email адреса     │
│                                 │
│  Здравствуйте!                  │
│                                 │
│  Спасибо за регистрацию...      │
│                                 │
│  ┌─────────────────────────┐   │
│  │  ✉️ Подтвердить email   │   │  ← Button
│  └─────────────────────────┘   │
│                                 │
│  ⏰ Важно: Ссылка действительна │
│  в течение 24 часов.            │
│                                 │
├─────────────────────────────────┤
│  © 2025 Student Deals           │  ← Footer
└─────────────────────────────────┘
```

## 🧪 Testing

### Development Mode (Mock)

Without `RESEND_API_KEY`, emails are mocked:

```bash
# 1. Start API
cd apps/api
PORT=3001 node dist/main.js

# 2. Register user
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Check logs
# Output:
# ⚠️  RESEND_API_KEY not set. Email sending will be mocked in development.
# 📧 [MOCK] Verification email would be sent to test@example.com
# 🔗 [MOCK] Verification URL: http://localhost:3000/ru/verify?token=abc123...

# 4. Copy token from logs and test verification
curl "http://localhost:3001/auth/verify?token=abc123..."
```

### Production Mode (Real Emails)

With `RESEND_API_KEY`, emails are sent via Resend:

```bash
# 1. Set environment variable
export RESEND_API_KEY=re_abc123...
export EMAIL_FROM="StudentDeals <noreply@studentdeals.uz>"
export APP_URL="https://studentdeals.uz"

# 2. Start API
cd apps/api
PORT=3001 node dist/main.js

# 3. Register user
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your-real-email@gmail.com","password":"password123"}'

# 4. Check your email inbox
# You should receive verification email

# 5. Click link or test via API
curl "http://localhost:3001/auth/verify?token=<TOKEN_FROM_EMAIL>"
```

## 📊 Monitoring

### Resend Dashboard

1. Go to [resend.com/emails](https://resend.com/emails)
2. View all sent emails
3. Check delivery status
4. View email content
5. Debug delivery issues

### API Logs

**Successful send:**
```
✅ Verification email sent to test@example.com (ID: abc-123-def)
```

**Mock mode:**
```
⚠️  RESEND_API_KEY not set. Email sending will be mocked in development.
📧 [MOCK] Verification email would be sent to test@example.com
🔗 [MOCK] Verification URL: http://localhost:3000/ru/verify?token=abc123...
```

**Error:**
```
❌ Resend error: { message: "Invalid API key" }
❌ Failed to send verification email: Error: Failed to send email: Invalid API key
```

## 🔐 Security Best Practices

### 1. Protect API Key

- ✅ Never commit `RESEND_API_KEY` to git
- ✅ Use environment variables only
- ✅ Rotate keys periodically
- ✅ Use different keys for staging/production

### 2. Verify Domain

- ✅ Add SPF, DKIM, DMARC records
- ✅ Verify domain in Resend dashboard
- ✅ Use verified domain for `EMAIL_FROM`

### 3. Rate Limiting

Resend free tier limits:
- **100 emails/day** (free)
- **3,000 emails/month** (free)

For higher limits, upgrade plan.

### 4. Monitor Delivery

- ✅ Check Resend dashboard regularly
- ✅ Monitor bounce rates
- ✅ Handle failed deliveries gracefully

## 🐛 Troubleshooting

### Email not received

**Problem:** User didn't receive verification email

**Solution:**
1. Check Resend dashboard for delivery status
2. Check spam folder
3. Verify domain is verified in Resend
4. Check API logs for errors
5. Test with different email provider

### Invalid API key error

**Problem:** `Error: Invalid API key`

**Solution:**
1. Check `RESEND_API_KEY` in Render environment variables
2. Regenerate API key in Resend dashboard
3. Update key in Render
4. Restart service

### Domain not verified

**Problem:** `Error: Domain not verified`

**Solution:**
1. Go to Resend → Domains
2. Check DNS records are added correctly
3. Wait for DNS propagation (up to 48 hours)
4. Use `nslookup` to verify DNS records:
```bash
nslookup -type=TXT studentdeals.uz
nslookup -type=MX studentdeals.uz
```

### Rate limit exceeded

**Problem:** `Error: Rate limit exceeded`

**Solution:**
1. Check current usage in Resend dashboard
2. Upgrade plan if needed
3. Implement email queuing for high volume
4. Add rate limiting on registration endpoint

## 📚 Useful Links

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference/emails/send-email)
- [Resend Node.js SDK](https://github.com/resendlabs/resend-node)
- [Email Best Practices](https://resend.com/docs/knowledge-base/email-best-practices)

## 💰 Pricing

### Free Tier
- ✅ 100 emails/day
- ✅ 3,000 emails/month
- ✅ 1 domain
- ✅ Email API
- ✅ Dashboard

### Pro Tier ($20/month)
- ✅ 50,000 emails/month
- ✅ Unlimited domains
- ✅ Custom SMTP
- ✅ Analytics
- ✅ Priority support

For StudentDeals.uz, free tier should be sufficient for initial launch.

## 🎯 Production Checklist

- [x] Resend account created
- [x] Domain `studentdeals.uz` added and verified ✅
- [x] DNS records (TXT, MX) configured ✅
- [x] API key generated (`re_HXW7aXez...`)
- [ ] `RESEND_API_KEY` added to Render
- [x] `EMAIL_FROM` uses verified domain ✅
- [ ] `APP_URL` points to production
- [x] Test email sent successfully (local)
- [ ] Verification flow tested end-to-end
- [ ] Monitoring setup in Resend dashboard

## 🚀 Next Steps for Production

### 1. Verify Domain in Resend

**Important:** Currently using API key, but emails from `noreply@studentdeals.uz` will be blocked until domain is verified.

**Steps:**
1. Go to [Resend Dashboard → Domains](https://resend.com/domains)
2. Click **Add Domain** → Enter `studentdeals.uz`
3. Add DNS records to your domain provider:

```dns
# Verification Record
Type: TXT
Name: @
Value: resend-verify=<YOUR_VERIFICATION_CODE>
TTL: 3600

# Email Sending Records
Type: MX
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: 3600

Type: TXT
Name: @
Value: "v=spf1 include:amazonses.com ~all"
TTL: 3600

# DKIM Records (will be provided by Resend after domain added)
Type: TXT
Name: resend._domainkey
Value: <PROVIDED_BY_RESEND>
TTL: 3600
```

4. Wait for DNS propagation (5-30 minutes)
5. Click **Verify Domain** in Resend dashboard

### 2. Update Render Environment Variables

Once domain is verified, update in Render:

```bash
# Render Dashboard → Your Service → Environment
RESEND_API_KEY=re_HXW7aXez_8P1z8kH1Z5gRopsSv2GyZtZS
EMAIL_FROM=StudentDeals <noreply@studentdeals.uz>
APP_URL=https://studentdeals.uz
EMAIL_TOKEN_TTL_HOURS=24
```

### 3. Test Production Email

```bash
# After deploying to Render
curl -X POST https://studentdeals-uz.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com","password":"TestPassword123!"}'

# Check your inbox for verification email
# Check Resend dashboard for delivery status
```

### 4. Monitor Delivery

- [Resend Dashboard → Emails](https://resend.com/emails) - View all sent emails
- [Resend Dashboard → Analytics](https://resend.com/analytics) - Delivery stats
- Check bounce rates and spam reports regularly

## ⚠️ Important Notes

### Domain Verification Required

**Without verified domain:**
- ✅ API works in development (localhost)
- ❌ Production emails will be rejected
- ❌ Cannot use `noreply@studentdeals.uz` as sender

**With verified domain:**
- ✅ Production emails delivered
- ✅ High deliverability rate
- ✅ SPF/DKIM/DMARC protection
- ✅ Professional sender reputation

### Temporary Solution (Testing Only)

If you need to test before domain verification:
```bash
# Use Resend's test domain (emails go to your Resend account email only)
EMAIL_FROM="onboarding@resend.dev"
```

This will work immediately but only sends to your Resend account email.

