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

- [ ] Resend account created
- [ ] Domain `studentdeals.uz` added and verified
- [ ] DNS records (TXT, MX) configured
- [ ] API key generated
- [ ] `RESEND_API_KEY` added to Render
- [ ] `EMAIL_FROM` uses verified domain
- [ ] `APP_URL` points to production
- [ ] Test email sent successfully
- [ ] Verification flow tested end-to-end
- [ ] Monitoring setup in Resend dashboard

