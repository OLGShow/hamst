# Система таблицы лидеров

## Концепция локальной таблицы лидеров

Поскольку игра работает локально без сервера, таблица лидеров будет хранить личные рекорды игрока в различных категориях.

## Категории рекордов

### 1. Основные рекорды
- **Максимальный счет** - самое большое количество очков за все время
- **Максимальные монеты** - самое большое количество монет за все время
- **Максимальный уровень** - самый высокий достигнутый уровень
- **Больше всего кликов за сессию** - рекорд кликов в одной игровой сессии

### 2. Скоростные рекорды
- **Самый быстрый миллион очков** - время достижения 1,000,000 очков
- **Самый быстрый 10 уровень** - время достижения 10 уровня
- **Максимальный CPS** - максимальные клики в секунду

### 3. Достижения
- **Самая длинная серия критов** - максимальное количество критических ударов подряд
- **Больше всего ачивок за день** - рекорд по количеству разблокированных ачивок
- **Самая дорогая покупка** - самое дорогое улучшение/буст

### 4. Временные рекорды
- **Самая длинная игровая сессия** - максимальное время непрерывной игры
- **Больше всего дней подряд** - рекорд последовательных дней игры

## Функциональность

### Отображение
- Красивая таблица с иконками для каждой категории
- Показ текущего значения и рекорда
- Прогресс до следующего рекорда
- Дата установления рекорда

### Уведомления
- Всплывающие уведомления при установлении нового рекорда
- Специальные эффекты для значимых достижений
- Звуковые сигналы (если добавим звук)

### Сброс рекордов
- Возможность сбросить все рекорды
- Подтверждение перед сбросом
- Экспорт/импорт рекордов

## Техническая реализация

### Структура данных
```javascript
leaderboard: {
    maxScore: { value: 0, date: null, session: 0 },
    maxCoins: { value: 0, date: null, session: 0 },
    maxLevel: { value: 1, date: null, session: 0 },
    maxClicksPerSession: { value: 0, date: null, session: 0 },
    fastestMillion: { value: null, date: null, session: 0 },
    fastest10Level: { value: null, date: null, session: 0 },
    maxCPS: { value: 0, date: null, session: 0 },
    maxCritStreak: { value: 0, date: null, session: 0 },
    maxAchievementsPerDay: { value: 0, date: null, session: 0 },
    mostExpensivePurchase: { value: 0, date: null, session: 0 },
    longestSession: { value: 0, date: null, session: 0 },
    maxConsecutiveDays: { value: 0, date: null, session: 0 }
}
```

### Функции
- `updateLeaderboard(category, value)` - обновление рекорда
- `checkNewRecord(category, currentValue)` - проверка нового рекорда
- `displayLeaderboard()` - отображение таблицы
- `resetLeaderboard()` - сброс всех рекордов
- `exportLeaderboard()` - экспорт данных
- `importLeaderboard(data)` - импорт данных

