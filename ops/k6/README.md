# K6 Load Testing Scripts

Набор скриптов для нагрузочного тестирования StudentDeals API с использованием k6.

## 📋 Обзор

- **smoke.js** - Базовые проверки здоровья API
- **auth.js** - Нагрузочное тестирование аутентификации с RPS ramp и think time

## 🚀 Установка

### Установка k6

```bash
# macOS (Homebrew)
brew install k6

# Ubuntu/Debian
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Windows (Chocolatey)
choco install k6

# Docker
docker pull grafana/k6:latest
```

## 🧪 Запуск тестов

### Smoke Test (Базовые проверки)

```bash
# Локальный API
k6 run smoke.js

# Удаленный API
BASE_URL=https://api.studentdeals.uz k6 run smoke.js

# С выводом в JSON
k6 run --out json=smoke-results.json smoke.js
```

### Auth Load Test (Нагрузочное тестирование)

```bash
# Локальный API
k6 run auth.js

# Удаленный API
BASE_URL=https://api.studentdeals.uz k6 run auth.js

# С выводом в JSON
k6 run --out json=auth-results.json auth.js

# С кастомными параметрами
k6 run --stage 30s:5,1m:10,30s:0 auth.js
```

## 📊 Thresholds (Пороги производительности)

### Smoke Test
- **http_req_duration**: 95% запросов < 500ms
- **http_req_failed**: < 10% ошибок
- **error_rate**: < 10% ошибок

### Auth Load Test
- **http_req_duration**: 95% запросов < 1s
- **http_req_failed**: < 5% ошибок
- **error_rate**: < 5% ошибок
- **auth_duration**: 95% auth операций < 800ms

## 🎯 Тестовые сценарии

### Smoke Test
1. **Health Check** - `/health` endpoint
2. **Database Health** - `/health/db` endpoint  
3. **Auth Login** - `/auth/login` с неверными данными (ожидается 401)

### Auth Load Test
1. **Health Check** - проверка доступности API
2. **User Registration** - регистрация новых пользователей
3. **User Login** - аутентификация существующих пользователей
4. **User Info** - получение информации о пользователе
5. **Email Verification** - проверка email верификации

## 📈 RPS Ramp (Загрузочная кривая)

### Smoke Test
- 30s: 0 → 1 user
- 1m: 1 user (стабильная нагрузка)
- 30s: 1 → 0 user

### Auth Load Test
- 2m: 0 → 10 users
- 5m: 10 users (стабильная нагрузка)
- 2m: 10 → 20 users
- 5m: 20 users (пиковая нагрузка)
- 2m: 20 → 0 users

## 🎭 Think Time

Auth Load Test включает реалистичное время ожидания между запросами:
- **Random sleep**: 1-3 секунды
- **Simulates**: реальное поведение пользователей

## 📁 Результаты

### JSON Output
Все тесты сохраняют результаты в JSON формате для анализа:

```bash
# Smoke test results
smoke-test-results.json

# Auth load test results  
auth-load-test-results.json
```

### S3/Artifacts Integration

```bash
# Запуск с сохранением в S3
k6 run --out json=s3://bucket/load-test-results.json auth.js

# Или через AWS CLI
k6 run --out json=results.json auth.js
aws s3 cp results.json s3://your-bucket/load-test-results.json
```

## 🔧 Конфигурация

### Environment Variables

```bash
# Base URL для API
export BASE_URL=http://localhost:3001

# Для production
export BASE_URL=https://api.studentdeals.uz
```

### Custom Stages

```bash
# Кастомная загрузочная кривая
k6 run --stage 1m:5,2m:10,1m:0 auth.js

# Параметры:
# 1m:5  - 1 минута до 5 пользователей
# 2m:10 - 2 минуты до 10 пользователей  
# 1m:0  - 1 минута до 0 пользователей
```

## 📊 Мониторинг

### Real-time Metrics
```bash
# Запуск с real-time метриками
k6 run --out influxdb=http://localhost:8086/k6 auth.js
```

### Grafana Dashboard
```bash
# Настройка Grafana для k6
# Dashboard ID: 2587
# Data Source: InfluxDB
```

## 🚨 Troubleshooting

### Common Issues

1. **Connection Refused**
   ```bash
   # Проверить что API запущен
   curl http://localhost:3001/health
   ```

2. **High Error Rate**
   ```bash
   # Уменьшить нагрузку
   k6 run --stage 1m:2,1m:2,1m:0 auth.js
   ```

3. **Memory Issues**
   ```bash
   # Ограничить память
   k6 run --max-vus 10 auth.js
   ```

### Debug Mode
```bash
# Подробные логи
k6 run --verbose auth.js

# С отладочной информацией
k6 run --log-output=file=debug.log auth.js
```

## 📚 Полезные команды

```bash
# Проверка версии k6
k6 version

# Список всех опций
k6 run --help

# Тест с одним пользователем
k6 run --vus 1 --duration 30s auth.js

# Тест с кастомными порогами
k6 run --threshold http_req_duration=p(95)<500 auth.js
```

## 🎯 Best Practices

1. **Начинайте с smoke test** - убедитесь что API работает
2. **Постепенно увеличивайте нагрузку** - не начинайте с высоких значений
3. **Мониторьте ресурсы** - CPU, память, сеть
4. **Анализируйте результаты** - используйте JSON output для анализа
5. **Тестируйте в production-like среде** - максимально приближенной к реальности

## 📞 Поддержка

При проблемах с тестами:
1. Проверьте логи API
2. Убедитесь что все endpoints доступны
3. Проверьте network connectivity
4. Уменьшите нагрузку для диагностики
