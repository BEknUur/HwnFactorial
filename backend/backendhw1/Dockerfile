# 1) Сборка фронтенда
FROM node:18-alpine AS frontend-build
WORKDIR /build-frontend

# 1.1) Устанавливаем зависимости и строим
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2) Сборка бэкенда и вшивка статики
FROM python:3.11
WORKDIR /app

# 2.1) Копируем переменные и зависимости
COPY .env .
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 2.2) Копируем код бэкенда и собранный фронт
COPY ./app ./app
# вот сюда кладём готовую папку dist
COPY --from=frontend-build /build-frontend/dist ./app/static

# 3) Запуск FastAPI
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
