# CS:GO Map Pool Website

Веб-сайт для управления мап-пулом CS:GO с панелью администратора.

## Особенности

- Отображение карт с баннерами и описанием
- Система аутентификации (Firebase Auth)
- Панель управления для изменения статуса карт
- Добавление/удаление карт
- Адаптивный дизайн

## Установка

1. Создайте проект на [Firebase Console](https://console.firebase.google.com/)
2. Включите Authentication (Email/Password) и Realtime Database
3. Скопируйте конфигурацию Firebase в `js/firebase-config.js`
4. Загрузите файлы на GitHub Pages

## Структура базы данных

```json
{
  "maps": {
    "dust2": {
      "name": "Dust II",
      "description": "Классическая пустынная карта",
      "bannerUrl": "URL_изображения",
      "status": "active"
    }
  }
}
