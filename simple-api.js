const http = require('http');
const url = require('url');

// Mock database
let users = [];
let feedback = [];

// Helper function to parse JSON body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Helper function to send JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

// Helper function to send CORS headers
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

const server = http.createServer(async (req, res) => {
  setCORSHeaders(res);
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  console.log(`${method} ${path}`);

  try {
    // Health endpoints
    if (path === '/health' && method === 'GET') {
      sendJSON(res, 200, {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
      return;
    }

    if (path === '/health/db' && method === 'GET') {
      sendJSON(res, 200, {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString()
      });
      return;
    }

    // Auth endpoints
    if (path === '/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password, firstName, lastName } = body;

      if (!email || !password || !firstName || !lastName) {
        sendJSON(res, 400, { error: 'Missing required fields' });
        return;
      }

      // Check if user already exists
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        sendJSON(res, 400, { error: 'User already exists' });
        return;
      }

      const user = {
        id: `user_${Date.now()}`,
        email,
        firstName,
        lastName,
        isVerified: false,
        createdAt: new Date().toISOString()
      };

      users.push(user);

      // Mock email sending
      console.log(`📧 [MOCK EMAIL] Verification email sent to ${email}`);
      console.log(`🔗 [MOCK EMAIL] Verification link: http://localhost:3000/ru/verify?token=${email.split('@')[0]}`);

      sendJSON(res, 201, {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified
        },
        message: 'User registered successfully. Please check your email for verification.'
      });
      return;
    }

    if (path === '/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password } = body;

      if (!email || !password) {
        sendJSON(res, 400, { error: 'Email and password are required' });
        return;
      }

      const user = users.find(u => u.email === email);
      if (!user) {
        sendJSON(res, 401, { error: 'Invalid credentials' });
        return;
      }

      // Mock JWT token
      const token = `mock-jwt-token-${Date.now()}`;

      sendJSON(res, 200, {
        accessToken: token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified
        }
      });
      return;
    }

    if (path === '/auth/me' && method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        sendJSON(res, 401, { error: 'Unauthorized' });
        return;
      }

      const token = authHeader.split(' ')[1];
      // Mock token validation - accept any token
      const user = users[0] || {
        id: 'mock-user',
        email: 'mock@example.com',
        firstName: 'Mock',
        lastName: 'User',
        isVerified: true
      };

      sendJSON(res, 200, { user });
      return;
    }

    // Feedback endpoints
    if (path === '/feedback' && method === 'POST') {
      const body = await parseBody(req);
      const { email, message, rating, page } = body;

      if (!message || message.length < 5 || message.length > 2000) {
        sendJSON(res, 400, { error: 'Message must be between 5 and 2000 characters' });
        return;
      }

      const feedbackItem = {
        id: `feedback_${Date.now()}`,
        email: email || null,
        message,
        rating: rating || null,
        page: page || null,
        createdAt: new Date().toISOString()
      };

      feedback.push(feedbackItem);

      sendJSON(res, 201, {
        id: feedbackItem.id,
        message: 'Feedback submitted successfully'
      });
      return;
    }

    if (path === '/feedback/stats' && method === 'GET') {
      const total = feedback.length;
      const avgRating = feedback.length > 0 
        ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.filter(f => f.rating).length 
        : 0;

      sendJSON(res, 200, {
        total,
        averageRating: avgRating || 0,
        distribution: {}
      });
      return;
    }

    // Admin endpoints
    if (path === '/admin/users' && method === 'GET') {
      sendJSON(res, 200, {
        users: users.map(u => ({
          id: u.id,
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          isVerified: u.isVerified,
          createdAt: u.createdAt
        }))
      });
      return;
    }

    if (path === '/admin/stats' && method === 'GET') {
      sendJSON(res, 200, {
        totalUsers: users.length,
        verifiedUsers: users.filter(u => u.isVerified).length,
        totalFeedback: feedback.length,
        averageRating: feedback.length > 0 
          ? feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.filter(f => f.rating).length 
          : 0
      });
      return;
    }

    // 404 for unknown routes
    sendJSON(res, 404, { error: 'Not found' });

  } catch (error) {
    console.error('Server error:', error);
    sendJSON(res, 500, { error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Simple API server running on http://localhost:${PORT}`);
  console.log(`📊 Mock data: ${users.length} users`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Available endpoints:`);
  console.log(`   GET  /health`);
  console.log(`   GET  /health/db`);
  console.log(`   POST /auth/register`);
  console.log(`   POST /auth/login`);
  console.log(`   GET  /auth/me`);
  console.log(`   POST /feedback`);
  console.log(`   GET  /feedback/stats`);
  console.log(`   GET  /admin/users`);
  console.log(`   GET  /admin/stats`);
});