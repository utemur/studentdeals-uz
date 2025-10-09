#!/bin/bash

# Простой скрипт для тестирования email verification
# Использование: ./test-email-simple.sh your-email@gmail.com

EMAIL=${1:-"test-$(date +%s)@example.com"}

echo "🧪 ТЕСТИРОВАНИЕ EMAIL VERIFICATION"
echo "===================================="
echo ""
echo "Email: $EMAIL"
echo "API: http://localhost:3001"
echo ""
echo "📤 Отправка запроса на регистрацию..."
echo ""

RESPONSE=$(curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"TestPassword123!\"}" \
  -s)

echo "$RESPONSE" | jq .

if echo "$RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
  echo ""
  echo "✅ Регистрация успешна!"
  echo ""
  echo "📬 Следующие шаги:"
  echo "   1. Проверьте Resend Dashboard:"
  echo "      https://resend.com/emails"
  echo ""
  echo "   2. Если email реальный - проверьте inbox:"
  echo "      От: StudentDeals <noreply@studentdeals.uz>"
  echo "      Тема: Подтверждение регистрации — StudentDeals"
  echo ""
  echo "   3. Нажмите кнопку в письме или скопируйте token"
  echo ""
  echo "   4. Проверьте verification:"
  echo "      curl \"http://localhost:3001/auth/verify?token=<TOKEN>\" | jq ."
  echo ""
else
  echo ""
  echo "❌ Ошибка регистрации!"
  echo ""
  echo "Возможные причины:"
  echo "- Email уже зарегистрирован"
  echo "- API не запущен (проверьте: curl http://localhost:3001/health)"
  echo "- Проблема с Resend API key"
fi

