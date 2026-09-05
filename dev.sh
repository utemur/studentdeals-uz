#!/bin/bash
# Kill anything already on port 3000, then start the dev server.
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "⚠️  Порт 3000 занят — останавливаю процесс..."
  kill -9 $(lsof -ti:3000) 2>/dev/null
  sleep 1
fi

echo "🚀 Запускаю StudentDeals.uz — http://localhost:3000"
pnpm dev
