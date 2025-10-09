#!/bin/bash

echo "🧪 ТЕСТИРОВАНИЕ EMAIL VERIFICATION"
echo "===================================="
echo ""
echo "Текущие настройки:"
echo "- API: http://localhost:3001"
echo "- FROM: onboarding@resend.dev (тестовый домен Resend)"
echo "- API Key: настроен ✅"
echo ""
echo "📧 Введите ваш email для получения письма:"
read -p "Email: " USER_EMAIL

if [ -z "$USER_EMAIL" ]; then
  echo "❌ Email не указан!"
  exit 1
fi

echo ""
echo "📤 Отправка запроса на регистрацию..."
echo ""

RESPONSE=$(curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$USER_EMAIL\",\"password\":\"TestPassword123!\"}" \
  -s)

echo "$RESPONSE" | jq .

if echo "$RESPONSE" | jq -e '.id' > /dev/null 2>&1; then
  echo ""
  echo "✅ Регистрация успешна!"
  echo ""
  echo "📬 Проверьте ваш inbox:"
  echo "   - От: onboarding@resend.dev"
  echo "   - Тема: Подтверждение регистрации — StudentDeals"
  echo "   - Проверьте также папку Spam"
  echo ""
  echo "🔗 Resend Dashboard (для отслеживания доставки):"
  echo "   https://resend.com/emails"
  echo ""
  echo "📊 Следующие шаги:"
  echo "   1. Откройте письмо в inbox"
  echo "   2. Нажмите кнопку 'Подтвердить email'"
  echo "   3. Или скопируйте ссылку из письма"
  echo "   4. Откройте в браузере: http://localhost:3000/ru/verify?token=..."
else
  echo ""
  echo "❌ Ошибка регистрации!"
  echo ""
  echo "Возможные причины:"
  echo "- Email уже зарегистрирован"
  echo "- API не запущен"
  echo "- Проблема с Resend API key"
fi

