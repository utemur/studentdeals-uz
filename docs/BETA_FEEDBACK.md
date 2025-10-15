# Beta Feedback System - StudentDeals.uz

Comprehensive beta feedback system for collecting user feedback during beta phase.

## 📊 Overview

The beta feedback system allows users to submit feedback with:
- ⭐ **Star Rating** (1-5 stars)
- 📧 **Email** (optional)
- 💬 **Message** (optional, max 1000 chars)
- 📍 **Page Context** (automatically tracked)
- 📈 **GA4 Event Tracking** (`feedback_submitted`)

## 🎯 Features

### User-Facing Features

- ✅ **Simple Form**: Email, rating, and message
- ✅ **Star Rating**: Visual 5-star rating system with emoji feedback
- ✅ **Success State**: Beautiful success confirmation
- ✅ **Bilingual**: Full Russian and Uzbek support
- ✅ **Responsive**: Works on all devices
- ✅ **Anonymous**: Email is optional

### Backend Features

- ✅ **NestJS API**: `/api/feedback` endpoint
- ✅ **Database Storage**: Prisma + PostgreSQL
- ✅ **Validation**: Email, rating (1-5), message length
- ✅ **Analytics**: GA4 event tracking
- ✅ **Logging**: Structured logging with Pino
- ✅ **Stats Endpoint**: `/api/feedback/stats` for analytics

## 🚀 Usage

### Accessing Beta Feedback Page

**URLs:**
- Russian: `https://studentdeals.uz/ru/beta`
- Uzbek: `https://studentdeals.uz/uz/beta`

**Local Development:**
- Russian: `http://localhost:3000/ru/beta`
- Uzbek: `http://localhost:3000/uz/beta`

### Submitting Feedback

1. Navigate to `/[locale]/beta`
2. (Optional) Enter email
3. Select star rating (1-5)
4. (Optional) Enter message
5. Click submit
6. See success confirmation

## 📡 API Endpoints

### POST /feedback

Submit new feedback.

**Request:**
```json
{
  "email": "user@example.com",  // Optional
  "rating": 5,                   // Required: 1-5
  "message": "Great platform!",  // Optional, max 1000 chars
  "page": "/beta"                // Optional
}
```

**Response:**
```json
{
  "success": true,
  "feedbackId": "clx123456",
  "message": "Thank you for your feedback!",
  "feedback": {
    "id": "clx123456",
    "email": "user@example.com",
    "rating": 5,
    "message": "Great platform!",
    "page": "/beta",
    "createdAt": "2025-10-12T13:54:51.719Z"
  }
}
```

**Validation:**
- `rating`: Required, integer, 1-5
- `email`: Optional, valid email format
- `message`: Optional, max 1000 characters
- `page`: Optional, max 500 characters

**Error Response:**
```json
{
  "statusCode": 400,
  "message": ["rating must be between 1 and 5"],
  "error": "Bad Request"
}
```

### GET /feedback/stats

Get feedback statistics (public endpoint).

**Response:**
```json
{
  "total": 150,
  "averageRating": 4.2,
  "distribution": {
    "1": 5,
    "2": 10,
    "3": 20,
    "4": 50,
    "5": 65
  }
}
```

### GET /feedback

Get user's own feedback (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": "clx123456",
    "rating": 5,
    "message": "Great platform!",
    "page": "/beta",
    "createdAt": "2025-10-12T13:54:51.719Z"
  }
]
```

## 📊 Database Schema

### Feedback Table

```prisma
model Feedback {
  id        String    @id @default(cuid())
  userId    String?   // Nullable - allow anonymous feedback
  email     String?   // Email for beta feedback (optional)
  rating    Int       // 1-5 star rating
  message   String?   // Optional free text feedback
  page      String?   // Page/context where feedback was submitted
  userAgent String?   // Browser/device info
  createdAt DateTime  @default(now())
  user      User?     @relation(fields: [userId], references: [id], onDelete: SetNull)

  // Indexes for performance
  @@index([userId])
  @@index([email])
  @@index([rating])
  @@index([createdAt])
  @@index([userId, createdAt])
  @@map("feedback")
}
```

**Indexes:**
- `userId`: For finding feedback by user
- `email`: For finding feedback by email
- `rating`: For analytics by rating
- `createdAt`: For chronological queries
- `userId, createdAt`: Composite for user's feedback over time

## 📈 GA4 Event Tracking

### Event: `feedback_submitted`

Automatically sent when user submits feedback.

**Event Parameters:**
```javascript
{
  rating: 5,                    // Star rating (1-5)
  has_message: true,            // Boolean: message provided
  has_email: true,              // Boolean: email provided
  page: '/beta',                // Page where submitted
  feedback_id: 'clx123456'      // Feedback ID
}
```

**Implementation:**
```typescript
window.gtag('event', 'feedback_submitted', {
  rating: formData.rating,
  has_message: !!formData.message,
  has_email: !!formData.email,
  page: '/beta',
  feedback_id: data.feedbackId,
});
```

**GA4 Dashboard:**
- Navigate to: Events → feedback_submitted
- View: Rating distribution, message rate, email rate
- Segment by: page, rating, time

## 🎨 UI/UX Design

### Star Rating Component

**Visual States:**
- **Empty**: Gray stars (⭐)
- **Filled**: Yellow stars (⭐)
- **Hover**: Scale animation (1.1x)

**Emoji Feedback:**
- 1 star: 😞 Very Bad / Juda yomon
- 2 stars: 😕 Bad / Yomon
- 3 stars: 😐 Okay / Normal
- 4 stars: 😊 Good / Yaxshi
- 5 stars: 😍 Excellent / Ajoyib

### Success State

**Design:**
- ✅ Green success banner
- 🎉 Celebration emoji
- 📝 Thank you message
- 🔄 "Submit another" button

**Copy (Russian):**
```
🎉 Спасибо за ваш отзыв!
Ваше мнение очень важно для нас. Мы используем ваши отзывы для улучшения платформы.
```

**Copy (Uzbek):**
```
🎉 Fikringiz uchun rahmat!
Sizning fikringiz biz uchun juda muhim. Biz sizning fikrlaringizdan platformani yaxshilash uchun foydalanamiz.
```

### Form Validation

**Client-Side:**
- Rating required (show error if not selected)
- Email format validation (if provided)
- Message length counter (0/1000)
- Disable submit if invalid

**Server-Side:**
- NestJS ValidationPipe
- class-validator decorators
- Return 400 Bad Request with error details

## 🔒 Security & Privacy

### Data Protection

- ✅ **Optional Email**: Users can submit anonymously
- ✅ **No PII Required**: Only email is optional
- ✅ **Rate Limiting**: Prevent spam (TODO: implement)
- ✅ **Input Validation**: Prevent XSS/injection
- ✅ **HTTPS Only**: Secure transmission (production)

### Privacy Considerations

- Email is optional and not shared
- User agent collected for analytics only
- No tracking cookies used
- Feedback is used for product improvement only
- Users can request deletion (GDPR compliance)

## 📊 Analytics & Reporting

### Key Metrics

**Quantitative:**
- Total feedback submissions
- Average rating
- Rating distribution (1-5 stars)
- Submission rate (% of visitors)
- Email opt-in rate

**Qualitative:**
- Message sentiment analysis
- Common themes/keywords
- Feature requests
- Bug reports

### Viewing Analytics

**GA4 Dashboard:**
1. Navigate to: Events → feedback_submitted
2. Add custom dimensions: rating, page
3. Create funnel: page_view → feedback_submitted

**Database Queries:**
```sql
-- Average rating by page
SELECT page, AVG(rating) as avg_rating, COUNT(*) as total
FROM feedback
GROUP BY page
ORDER BY total DESC;

-- Recent feedback with high ratings
SELECT email, rating, message, createdAt
FROM feedback
WHERE rating >= 4
ORDER BY createdAt DESC
LIMIT 10;

-- Feedback trends over time
SELECT DATE(createdAt) as date, COUNT(*) as submissions, AVG(rating) as avg_rating
FROM feedback
GROUP BY DATE(createdAt)
ORDER BY date DESC;
```

## 🛠️ Development

### Local Setup

```bash
# 1. Start API server
cd apps/api
pnpm dev

# 2. Start web app
cd apps/web
pnpm dev

# 3. Navigate to beta page
open http://localhost:3000/ru/beta
```

### Testing

**Manual Testing:**
```bash
# Submit feedback via API
curl -X POST http://localhost:3001/feedback \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "rating": 5,
    "message": "Test feedback",
    "page": "/beta"
  }'

# Get stats
curl http://localhost:3001/feedback/stats
```

**E2E Testing:**
```bash
# Run Playwright tests
pnpm --filter web exec playwright test e2e/beta-feedback.spec.ts
```

### Database Migration

```bash
# Create migration
cd apps/api
pnpm exec prisma migrate dev --name add_email_to_feedback

# Apply migration (production)
pnpm exec prisma migrate deploy
```

## 🚀 Deployment

### Environment Variables

**Required:**
```bash
DATABASE_URL=postgresql://...           # PostgreSQL connection
NEXT_PUBLIC_API_URL=https://api.studentdeals.uz
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXX
```

**Optional:**
```bash
LOG_LEVEL=info                          # Logging level
SENTRY_DSN=https://...                  # Error tracking
```

### Production Checklist

- [ ] Database migration applied
- [ ] API endpoint deployed
- [ ] Web page deployed
- [ ] GA4 tracking verified
- [ ] HTTPS enabled
- [ ] Rate limiting configured
- [ ] Error monitoring active
- [ ] Analytics dashboard set up

## 📚 Best Practices

### For Users

1. **Be Specific**: Provide detailed feedback
2. **Be Constructive**: Focus on improvements
3. **Include Context**: Mention specific features
4. **Provide Email**: For follow-up (optional)

### For Developers

1. **Monitor Feedback**: Check daily
2. **Respond Quickly**: Address critical issues
3. **Categorize**: Tag feedback by type
4. **Act On It**: Implement improvements
5. **Close Loop**: Inform users of changes

### For Product Managers

1. **Analyze Trends**: Look for patterns
2. **Prioritize**: Focus on high-impact items
3. **Measure Impact**: Track rating changes
4. **Communicate**: Share insights with team
5. **Iterate**: Continuously improve

## 🐛 Troubleshooting

### Common Issues

#### 1. Feedback Not Submitting

**Symptoms:**
- Form submission fails
- Error message displayed

**Solutions:**
1. Check API server is running
2. Verify network connectivity
3. Check browser console for errors
4. Verify rating is selected

#### 2. GA4 Event Not Tracking

**Symptoms:**
- Event not appearing in GA4

**Solutions:**
1. Verify GA4 measurement ID
2. Check gtag is loaded
3. Use GA4 DebugView
4. Wait 24-48 hours for data

#### 3. Database Connection Error

**Symptoms:**
- 500 Internal Server Error
- "Cannot connect to database"

**Solutions:**
1. Check DATABASE_URL
2. Verify database is running
3. Check Prisma schema is synced
4. Run migrations

## 📞 Support

For issues or questions:

1. Check this documentation
2. Review API logs
3. Check GA4 dashboard
4. Contact development team

## 🎯 Future Improvements

- [ ] Add image upload for screenshots
- [ ] Implement rate limiting
- [ ] Add feedback categories/tags
- [ ] Email notifications for high-priority feedback
- [ ] Admin dashboard for feedback management
- [ ] Sentiment analysis
- [ ] Automated responses
- [ ] Feedback voting system
- [ ] Public feedback board
- [ ] Integration with Jira/Linear

---

**Last Updated**: October 12, 2025
**Maintained By**: StudentDeals.uz Development Team

