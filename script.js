// Игровые переменные
let gameState = {
    score: 0,
    coins: 0,
    gems: 0, // Новая премиум валюта
    experience: 0, // Опыт игрока
    level: 1, // Уровень игрока
    skillPoints: 0, // Очки скиллов
    pointsPerClick: 1,
    autoPointsPerSecond: 0,
    multiplier: 1,
    totalClicks: 0,
    clicksThisSecond: 0,
    cps: 0,
    
    // Система скинов
    currentSkin: 'classic',
    unlockedSkins: ['classic'],
    
    // Система скиллов
    skills: {
        // Пассивные скиллы
        strength: 0,      // Сила удара (+1% урона за уровень)
        speed: 0,         // Скорость (+2% автоклика за уровень)
        luck: 0,          // Удача (+0.5% крита за уровень)
        magnetism: 0,     // Магнетизм (+1% монет за уровень)
        endurance: 0,     // Выносливость (+2% длительности бустов за уровень)
        
        // Активные скиллы (кулдауны в миллисекундах)
        berserkCooldown: 0,
        goldenTouchCooldown: 0,
        timeLoopCooldown: 0
    },
    
    // Система ачивок
    achievements: {
        firstClick: false,
        hundredClicks: false,
        thousandClicks: false,
        clickMaster: false,
        clickLegend: false,
        firstPoints: false,
        thousandPoints: false,
        millionaire: false,
        billionaire: false,
        firstUpgrade: false,
        collector: false,
        maximalist: false,
        firstBoost: false,
        boostLover: false,
        boostMaster: false,
        hourPlayed: false,
        dayPlayed: false,
        weekPlayed: false,
        criticalMaster: false,
        adGuru: false
    },
    
    // Статистика для ачивок
    stats: {
        criticalHits: 0,
        playTime: 0, // в миллисекундах
        lastPlaySession: Date.now(),
        consecutiveDays: 0,
        lastDayPlayed: null,
        sessionClicks: 0, // клики в текущей сессии
        sessionStartTime: Date.now(),
        critStreak: 0, // текущая серия критов
        maxCritStreak: 0, // максимальная серия критов
        achievementsToday: 0,
        lastAchievementDay: null
    },
    
    // Таблица лидеров (личные рекорды)
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
    },
    
    // Активные эффекты
    activeEffects: {
        turboMode: { active: false, endTime: 0, multiplier: 1.5 },
        vitamins: { active: false, endTime: 0, multiplier: 1.25 },
        goldenHamster: { active: false, endTime: 0, coinMultiplier: 3 },
        superMultiplier: { active: false, endTime: 0, multiplier: 5 },
        divineBlessing: { active: false, endTime: 0 }
    },
    
    // Постоянные улучшения
    permanentBoosts: {
        fastPaws: 0,        // +1 очко за клик за уровень
        energyDrink: 0,     // +2 очка/сек за уровень
        coinMagnet: 0,      // +1 монета за клик за уровень
        doubleHit: 0,       // 10% шанс x2 за уровень
        luckyPaw: 0,        // 5% шанс x5 за уровень
        hamsterFamily: 0,   // +3 очка/сек за уровень
        goldenTeeth: 0,     // +2 очка за клик за уровень
        diamondClaws: 0,    // +5 очков за клик за уровень (премиум)
        royalCrown: 0,      // +100% доходов за уровень (премиум)
        infiniteEnergy: 0,  // x2 скорость автоклика за уровень (премиум)
        criticalHit: 0,     // 20% шанс x3 за уровень (премиум)
        autoCollector: 0,   // автосбор монет за уровень (премиум)
        divineBlessing: 0   // бусты длятся в 2 раза дольше (премиум)
    },
    
    // Статистика для рекламы
    adsWatched: 0,
    lastAdTime: 0,
    dailyAdLimit: 5,
    
    upgrades: {
        click: {
            level: 0,
            baseCost: 10,
            costMultiplier: 1.5
        },
        auto: {
            level: 0,
            baseCost: 50,
            costMultiplier: 2
        },
        multiplier: {
            level: 0,
            baseCost: 100,
            costMultiplier: 3
        }
    }
};

// DOM элементы
const hamster = document.getElementById('hamster');
const scoreElement = document.getElementById('score');
const coinsElement = document.getElementById('coins');
const gemsElement = document.getElementById('gems');
const clickEffect = document.getElementById('click-effect');
const totalClicksElement = document.getElementById('total-clicks');
const cpsElement = document.getElementById('cps');
const pointsPerClickElement = document.getElementById('points-per-click');
const autoPointsElement = document.getElementById('auto-points');

// Обработчик клика по хомяку
hamster.addEventListener('click', (e) => {
    clickHamster(e);
});

// Обработчик для мобильных устройств
hamster.addEventListener('touchstart', (e) => {
    e.preventDefault();
    clickHamster(e.touches[0]);
});

function clickHamster(event) {
    // Вычисляем базовые очки с учетом постоянных улучшений
    let basePoints = gameState.pointsPerClick;
    basePoints += gameState.permanentBoosts.fastPaws;
    basePoints += gameState.permanentBoosts.goldenTeeth * 2;
    basePoints += gameState.permanentBoosts.diamondClaws * 5;
    
    // Применяем множители
    let totalMultiplier = gameState.multiplier;
    if (gameState.activeEffects.turboMode.active && Date.now() < gameState.activeEffects.turboMode.endTime) {
        totalMultiplier *= gameState.activeEffects.turboMode.multiplier;
    }
    if (gameState.activeEffects.vitamins.active && Date.now() < gameState.activeEffects.vitamins.endTime) {
        totalMultiplier *= gameState.activeEffects.vitamins.multiplier;
    }
    if (gameState.activeEffects.superMultiplier.active && Date.now() < gameState.activeEffects.superMultiplier.endTime) {
        totalMultiplier *= gameState.activeEffects.superMultiplier.multiplier;
    }
    
    // Добавляем эффект королевской короны
    totalMultiplier *= (1 + gameState.permanentBoosts.royalCrown);
    
    let pointsEarned = Math.floor(basePoints * totalMultiplier);
    
    // Проверяем критический удар
    let isCritical = false;
    if (gameState.permanentBoosts.criticalHit > 0) {
        const critChance = gameState.permanentBoosts.criticalHit * 0.2; // 20% за уровень
        if (Math.random() < critChance) {
            pointsEarned *= 3;
            gameState.stats.criticalHits++; // Добавляем в статистику
            isCritical = true;
            showSpecialEffect('КРИТИЧЕСКИЙ УДАР!', '#ff0000');
        }
    }
    
    // Добавляем шанс крита от скилла удачи
    if (gameState.skills.luck > 0) {
        const luckCritChance = gameState.skills.luck * 0.005; // 0.5% за уровень
        if (Math.random() < luckCritChance) {
            pointsEarned *= 2;
            gameState.stats.criticalHits++; // Добавляем в статистику
            isCritical = true;
            showSpecialEffect('УДАЧНЫЙ УДАР!', '#4CAF50');
        }
    }
    
    // Проверяем двойной удар
    if (gameState.permanentBoosts.doubleHit > 0) {
        const doubleChance = gameState.permanentBoosts.doubleHit * 0.1; // 10% за уровень
        if (Math.random() < doubleChance) {
            pointsEarned *= 2;
            showSpecialEffect('ДВОЙНОЙ УДАР!', '#00ff00');
        }
    }
    
    // Проверяем счастливую лапку
    if (gameState.permanentBoosts.luckyPaw > 0) {
        const luckyChance = gameState.permanentBoosts.luckyPaw * 0.05; // 5% за уровень
        if (Math.random() < luckyChance) {
            pointsEarned *= 5;
            showSpecialEffect('СЧАСТЛИВЫЙ УДАР!', '#ffd700');
        }
    }
    
    // Вычисляем монеты
    let coinsEarned = 1 + gameState.permanentBoosts.coinMagnet;
    if (gameState.activeEffects.goldenHamster.active && Date.now() < gameState.activeEffects.goldenHamster.endTime) {
        coinsEarned *= gameState.activeEffects.goldenHamster.coinMultiplier;
    }
    
    // Добавляем опыт за клик
    addExperience(1);
    
    // Обновляем статистику кликов
    updateClickStatistics(isCritical);
    
    // Обновляем счетчики
    gameState.score += pointsEarned;
    gameState.coins += coinsEarned;
    gameState.totalClicks++;
    gameState.clicksThisSecond++;
    
    // Показываем эффект клика
    showClickEffect(pointsEarned, event);
    
    // Проверяем ачивки
    checkAchievements();
    
    // Проверяем рекорды
    checkLeaderboardRecords();
    
    // Обновляем отображение
    updateDisplay();
    
    // Сохраняем прогресс
    saveGame();
}

function showClickEffect(points, event) {
    // Создаем элемент эффекта
    const effect = document.createElement('div');
    effect.className = 'click-effect show';
    effect.textContent = `+${points}`;
    
    // Позиционируем относительно клика
    const rect = hamster.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    effect.style.position = 'absolute';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.pointerEvents = 'none';
    effect.style.fontSize = '2rem';
    effect.style.fontWeight = 'bold';
    effect.style.color = '#ff6b35';
    effect.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.3)';
    effect.style.zIndex = '10';
    
    hamster.parentElement.appendChild(effect);
    
    // Анимация
    effect.style.animation = 'clickEffect 0.8s ease-out';
    
    // Удаляем элемент после анимации
    setTimeout(() => {
        if (effect.parentElement) {
            effect.parentElement.removeChild(effect);
        }
    }, 800);
}

function buyUpgrade(type) {
    const upgrade = gameState.upgrades[type];
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
    
    if (gameState.coins >= cost) {
        gameState.coins -= cost;
        upgrade.level++;
        
        // Применяем эффект улучшения
        switch(type) {
            case 'click':
                gameState.pointsPerClick++;
                break;
            case 'auto':
                gameState.autoPointsPerSecond++;
                break;
            case 'multiplier':
                gameState.multiplier *= 2;
                break;
        }
        
        updateDisplay();
        updateUpgradeCosts();
        saveGame();
        
        // Показываем уведомление
        showNotification(`Улучшение "${getUpgradeName(type)}" куплено!`);
    } else {
        showNotification('Недостаточно монет!', 'error');
    }
}

function getUpgradeName(type) {
    const names = {
        'click': 'Сильные лапки',
        'auto': 'Автокликер',
        'multiplier': 'Множитель'
    };
    return names[type];
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '10px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '1000';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

function updateDisplay() {
    scoreElement.textContent = formatNumber(gameState.score);
    coinsElement.textContent = formatNumber(gameState.coins);
    totalClicksElement.textContent = formatNumber(gameState.totalClicks);
    pointsPerClickElement.textContent = formatNumber(gameState.pointsPerClick * gameState.multiplier);
    autoPointsElement.textContent = formatNumber(gameState.autoPointsPerSecond * gameState.multiplier);
    cpsElement.textContent = gameState.cps;
}

function updateUpgradeCosts() {
    // Обновляем стоимость улучшений
    Object.keys(gameState.upgrades).forEach(type => {
        const upgrade = gameState.upgrades[type];
        const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level));
        const costElement = document.getElementById(`${type}-cost`);
        if (costElement) {
            costElement.textContent = formatNumber(cost);
        }
        
        // Обновляем доступность кнопок
        const button = document.querySelector(`#upgrade-${type} .upgrade-btn`);
        if (button) {
            button.disabled = gameState.coins < cost;
        }
    });
}

function formatNumber(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Автоматическое получение очков
function autoClick() {
    if (gameState.autoPointsPerSecond > 0) {
        const pointsEarned = gameState.autoPointsPerSecond * gameState.multiplier;
        gameState.score += pointsEarned;
        gameState.coins += Math.floor(pointsEarned / 10);
        updateDisplay();
    }
}

// Подсчет кликов в секунду
function updateCPS() {
    gameState.cps = gameState.clicksThisSecond;
    gameState.clicksThisSecond = 0;
    updateDisplay();
}

// Сохранение игры
function saveGame() {
    localStorage.setItem('hamsterTapGame', JSON.stringify(gameState));
}

// Загрузка игры
function loadGame() {
    const saved = localStorage.getItem('hamsterTapGame');
    if (saved) {
        const savedState = JSON.parse(saved);
        // Объединяем сохраненное состояние с текущим (для совместимости)
        gameState = { ...gameState, ...savedState };
        updateDisplay();
        updateUpgradeCosts();
    }
}

// Сброс игры
function resetGame() {
    if (confirm('Вы уверены, что хотите сбросить игру? Весь прогресс будет потерян!')) {
        localStorage.removeItem('hamsterTapGame');
        location.reload();
    }
}

// Добавляем кнопку сброса
function addResetButton() {
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Сбросить игру';
    resetBtn.style.position = 'fixed';
    resetBtn.style.bottom = '20px';
    resetBtn.style.left = '20px';
    resetBtn.style.padding = '10px 20px';
    resetBtn.style.background = '#f44336';
    resetBtn.style.color = 'white';
    resetBtn.style.border = 'none';
    resetBtn.style.borderRadius = '5px';
    resetBtn.style.cursor = 'pointer';
    resetBtn.style.fontSize = '14px';
    resetBtn.onclick = resetGame;
    document.body.appendChild(resetBtn);
}

// Добавляем CSS для анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    updateDisplay();
    updateUpgradeCosts();
    addResetButton();
    
    // Запускаем таймеры
    setInterval(autoClick, 1000); // Автоклик каждую секунду
    setInterval(updateCPS, 1000); // Обновление CPS каждую секунду
    setInterval(saveGame, 5000); // Автосохранение каждые 5 секунд
});

// Сохранение при закрытии страницы
window.addEventListener('beforeunload', saveGame);


// Функция для показа специальных эффектов
function showSpecialEffect(text, color) {
    const effect = document.createElement('div');
    effect.textContent = text;
    effect.style.position = 'fixed';
    effect.style.top = '50%';
    effect.style.left = '50%';
    effect.style.transform = 'translate(-50%, -50%)';
    effect.style.fontSize = '3rem';
    effect.style.fontWeight = 'bold';
    effect.style.color = color;
    effect.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
    effect.style.zIndex = '1000';
    effect.style.pointerEvents = 'none';
    effect.style.animation = 'specialEffect 1.5s ease-out';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentElement) {
            effect.parentElement.removeChild(effect);
        }
    }, 1500);
}

// Функция просмотра рекламы за награду
function watchRewardedAd() {
    const now = Date.now();
    const dayStart = new Date().setHours(0, 0, 0, 0);
    
    // Проверяем дневной лимит
    if (gameState.adsWatched >= gameState.dailyAdLimit) {
        showNotification('Дневной лимит просмотра рекламы исчерпан!', 'error');
        return;
    }
    
    // Проверяем кулдаун (30 секунд между просмотрами)
    if (now - gameState.lastAdTime < 30000) {
        const remaining = Math.ceil((30000 - (now - gameState.lastAdTime)) / 1000);
        showNotification(`Подождите ${remaining} секунд до следующей рекламы`, 'error');
        return;
    }
    
    // Имитируем просмотр рекламы
    showNotification('Просмотр рекламы...', 'info');
    
    setTimeout(() => {
        gameState.coins += 50;
        gameState.gems += 1;
        gameState.adsWatched++;
        gameState.lastAdTime = now;
        
        updateDisplay();
        saveGame();
        
        showNotification('Получено: 50 монет и 1 кристалл!', 'success');
        
        // Обновляем кнопку
        updateAdButton();
    }, 3000); // 3 секунды "просмотра"
}

// Обновление кнопки рекламы
function updateAdButton() {
    const button = document.getElementById('watch-ad-btn');
    if (!button) return;
    
    const now = Date.now();
    const remaining = Math.max(0, 30000 - (now - gameState.lastAdTime));
    
    if (gameState.adsWatched >= gameState.dailyAdLimit) {
        button.textContent = '📺 Лимит рекламы исчерпан';
        button.disabled = true;
    } else if (remaining > 0) {
        button.textContent = `📺 Подождите ${Math.ceil(remaining / 1000)}с`;
        button.disabled = true;
    } else {
        button.textContent = '📺 50 монет + 1 кристалл за просмотр рекламы';
        button.disabled = false;
    }
}

// Система бустов
const boostDefinitions = {
    // Обычные бусты (за монеты)
    fastPaws: { name: 'Быстрые лапки', cost: 15, currency: 'coins', description: '+1 очко за клик' },
    energyDrink: { name: 'Энергетический напиток', cost: 75, currency: 'coins', description: '+2 очка в секунду' },
    coinMagnet: { name: 'Магнит для монет', cost: 100, currency: 'coins', description: '+1 монета за клик' },
    doubleHit: { name: 'Двойной удар', cost: 200, currency: 'coins', description: '10% шанс x2 очков' },
    luckyPaw: { name: 'Счастливая лапка', cost: 500, currency: 'coins', description: '5% шанс x5 очков' },
    hamsterFamily: { name: 'Хомячья семья', cost: 300, currency: 'coins', description: '+3 очка в секунду' },
    goldenTeeth: { name: 'Золотые зубы', cost: 400, currency: 'coins', description: '+2 очка за клик' },
    
    // Временные бусты (за монеты)
    turboMode: { name: 'Турбо режим', cost: 150, currency: 'coins', description: '+50% скорости на 60с', temporary: true },
    vitamins: { name: 'Витамины', cost: 250, currency: 'coins', description: '+25% доходов на 5 мин', temporary: true },
    megaClick: { name: 'Мега-клик', cost: 100, currency: 'coins', description: 'Следующий клик x10', temporary: true },
    
    // Премиум бусты (за кристаллы)
    diamondClaws: { name: 'Алмазные когти', cost: 10, currency: 'gems', description: '+5 очков за клик' },
    royalCrown: { name: 'Королевская корона', cost: 50, currency: 'gems', description: '+100% ко всем доходам' },
    infiniteEnergy: { name: 'Бесконечная энергия', cost: 30, currency: 'gems', description: 'x2 скорость автоклика' },
    criticalHit: { name: 'Критический удар', cost: 40, currency: 'gems', description: '20% шанс x3 урона' },
    autoCollector: { name: 'Автосборщик', cost: 45, currency: 'gems', description: 'Автосбор монет каждые 10с' },
    divineBlessing: { name: 'Божественное благословение', cost: 100, currency: 'gems', description: 'Бусты длятся в 2 раза дольше' },
    
    // Премиум временные бусты
    timeMachine: { name: 'Машина времени', cost: 25, currency: 'gems', description: 'Доход за 1 час мгновенно', temporary: true },
    goldenHamster: { name: 'Золотой хомяк', cost: 15, currency: 'gems', description: 'x3 монет на 30 мин', temporary: true },
    moneyRain: { name: 'Денежный дождь', cost: 20, currency: 'gems', description: '1000 монет мгновенно', temporary: true },
    superMultiplier: { name: 'Супер-множитель', cost: 35, currency: 'gems', description: 'x5 доходов на 10 мин', temporary: true }
};

// Функция покупки буста
function buyBoost(boostId) {
    const boost = boostDefinitions[boostId];
    if (!boost) return;
    
    const currency = boost.currency === 'coins' ? gameState.coins : gameState.gems;
    
    if (currency < boost.cost) {
        showNotification(`Недостаточно ${boost.currency === 'coins' ? 'монет' : 'кристаллов'}!`, 'error');
        return;
    }
    
    // Списываем валюту
    if (boost.currency === 'coins') {
        gameState.coins -= boost.cost;
    } else {
        gameState.gems -= boost.cost;
    }
    
    // Применяем эффект
    if (boost.temporary) {
        applyTemporaryBoost(boostId);
    } else {
        gameState.permanentBoosts[boostId]++;
    }
    
    updateDisplay();
    saveGame();
    showNotification(`Куплен буст: ${boost.name}!`, 'success');
}

// Применение временных бустов
function applyTemporaryBoost(boostId) {
    const now = Date.now();
    let duration = 60000; // 1 минута по умолчанию
    
    switch(boostId) {
        case 'turboMode':
            duration = 60000; // 1 минута
            gameState.activeEffects.turboMode.active = true;
            gameState.activeEffects.turboMode.endTime = now + duration;
            break;
        case 'vitamins':
            duration = 300000; // 5 минут
            gameState.activeEffects.vitamins.active = true;
            gameState.activeEffects.vitamins.endTime = now + duration;
            break;
        case 'goldenHamster':
            duration = 1800000; // 30 минут
            gameState.activeEffects.goldenHamster.active = true;
            gameState.activeEffects.goldenHamster.endTime = now + duration;
            break;
        case 'superMultiplier':
            duration = 600000; // 10 минут
            gameState.activeEffects.superMultiplier.active = true;
            gameState.activeEffects.superMultiplier.endTime = now + duration;
            break;
        case 'megaClick':
            // Специальный эффект для следующего клика
            gameState.nextClickMultiplier = 10;
            break;
        case 'timeMachine':
            // Мгновенный доход за час
            const hourlyIncome = gameState.autoPointsPerSecond * 3600;
            gameState.score += hourlyIncome;
            gameState.coins += Math.floor(hourlyIncome / 10);
            break;
        case 'moneyRain':
            // Мгновенно 1000 монет
            gameState.coins += 1000;
            break;
    }
    
    // Если есть божественное благословение, удваиваем время
    if (gameState.permanentBoosts.divineBlessing > 0 && duration > 0) {
        const effect = gameState.activeEffects[boostId];
        if (effect) {
            effect.endTime += duration; // Удваиваем время
        }
    }
}

// Обновляем функцию updateDisplay
function updateDisplay() {
    scoreElement.textContent = formatNumber(gameState.score);
    coinsElement.textContent = formatNumber(gameState.coins);
    if (gemsElement) gemsElement.textContent = formatNumber(gameState.gems);
    totalClicksElement.textContent = formatNumber(gameState.totalClicks);
    
    // Вычисляем текущие значения с учетом бустов
    let currentPointsPerClick = gameState.pointsPerClick;
    currentPointsPerClick += gameState.permanentBoosts.fastPaws;
    currentPointsPerClick += gameState.permanentBoosts.goldenTeeth * 2;
    currentPointsPerClick += gameState.permanentBoosts.diamondClaws * 5;
    
    let currentAutoPoints = gameState.autoPointsPerSecond;
    currentAutoPoints += gameState.permanentBoosts.energyDrink * 2;
    currentAutoPoints += gameState.permanentBoosts.hamsterFamily * 3;
    currentAutoPoints *= (1 + gameState.permanentBoosts.infiniteEnergy);
    
    pointsPerClickElement.textContent = formatNumber(currentPointsPerClick * gameState.multiplier);
    autoPointsElement.textContent = formatNumber(currentAutoPoints * gameState.multiplier);
    cpsElement.textContent = gameState.cps;
}

// Добавляем CSS для специальных эффектов
const specialEffectStyle = document.createElement('style');
specialEffectStyle.textContent += `
    @keyframes specialEffect {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1) translateY(-50px);
        }
    }
`;
document.head.appendChild(specialEffectStyle);


// Инициализация бустов в интерфейсе
function initializeBoosts() {
    const regularBoostsContainer = document.getElementById('regular-boosts');
    const premiumBoostsContainer = document.getElementById('premium-boosts');
    
    if (!regularBoostsContainer || !premiumBoostsContainer) return;
    
    // Очищаем контейнеры
    regularBoostsContainer.innerHTML = '';
    premiumBoostsContainer.innerHTML = '';
    
    // Создаем элементы бустов
    Object.entries(boostDefinitions).forEach(([boostId, boost]) => {
        const boostElement = createBoostElement(boostId, boost);
        
        if (boost.currency === 'coins') {
            regularBoostsContainer.appendChild(boostElement);
        } else {
            premiumBoostsContainer.appendChild(boostElement);
        }
    });
}

// Создание элемента буста
function createBoostElement(boostId, boost) {
    const boostDiv = document.createElement('div');
    boostDiv.className = `boost-item ${boost.currency === 'gems' ? 'premium' : ''} ${boost.temporary ? 'temporary' : ''}`;
    boostDiv.id = `boost-${boostId}`;
    
    const currentLevel = gameState.permanentBoosts[boostId] || 0;
    const levelDisplay = boost.temporary ? '' : `<span class="boost-level">Ур. ${currentLevel}</span>`;
    
    boostDiv.innerHTML = `
        <div class="boost-info">
            <h4>${boost.name} ${levelDisplay}</h4>
            <p>${boost.description}</p>
            <span class="boost-cost">Стоимость: ${boost.cost} ${boost.currency === 'coins' ? 'монет' : 'кристаллов'}</span>
        </div>
        <button class="boost-btn" onclick="buyBoost('${boostId}')">Купить</button>
    `;
    
    return boostDiv;
}

// Обновление состояния бустов
function updateBoostsDisplay() {
    Object.entries(boostDefinitions).forEach(([boostId, boost]) => {
        const boostElement = document.getElementById(`boost-${boostId}`);
        if (!boostElement) return;
        
        const button = boostElement.querySelector('.boost-btn');
        const currency = boost.currency === 'coins' ? gameState.coins : gameState.gems;
        
        // Обновляем доступность кнопки
        button.disabled = currency < boost.cost;
        
        // Обновляем уровень для постоянных бустов
        if (!boost.temporary) {
            const levelSpan = boostElement.querySelector('.boost-level');
            if (levelSpan) {
                const currentLevel = gameState.permanentBoosts[boostId] || 0;
                levelSpan.textContent = `Ур. ${currentLevel}`;
            }
        }
    });
}

// Обновляем автоклик с учетом новых бустов
function autoClick() {
    if (gameState.autoPointsPerSecond > 0) {
        let autoPoints = gameState.autoPointsPerSecond;
        
        // Добавляем бусты
        autoPoints += gameState.permanentBoosts.energyDrink * 2;
        autoPoints += gameState.permanentBoosts.hamsterFamily * 3;
        
        // Применяем множители
        autoPoints *= (1 + gameState.permanentBoosts.infiniteEnergy);
        autoPoints *= gameState.multiplier;
        
        // Применяем временные эффекты
        if (gameState.activeEffects.turboMode.active && Date.now() < gameState.activeEffects.turboMode.endTime) {
            autoPoints *= gameState.activeEffects.turboMode.multiplier;
        }
        if (gameState.activeEffects.vitamins.active && Date.now() < gameState.activeEffects.vitamins.endTime) {
            autoPoints *= gameState.activeEffects.vitamins.multiplier;
        }
        if (gameState.activeEffects.superMultiplier.active && Date.now() < gameState.activeEffects.superMultiplier.endTime) {
            autoPoints *= gameState.activeEffects.superMultiplier.multiplier;
        }
        
        // Добавляем эффект королевской короны
        autoPoints *= (1 + gameState.permanentBoosts.royalCrown);
        
        const pointsEarned = Math.floor(autoPoints);
        let coinsEarned = Math.floor(pointsEarned / 10);
        
        // Применяем эффект золотого хомяка
        if (gameState.activeEffects.goldenHamster.active && Date.now() < gameState.activeEffects.goldenHamster.endTime) {
            coinsEarned *= gameState.activeEffects.goldenHamster.coinMultiplier;
        }
        
        gameState.score += pointsEarned;
        gameState.coins += coinsEarned;
        updateDisplay();
    }
    
    // Автосборщик монет
    if (gameState.permanentBoosts.autoCollector > 0) {
        const bonusCoins = gameState.permanentBoosts.autoCollector * 5; // 5 монет за уровень каждые 10 секунд
        gameState.coins += bonusCoins;
        
        // Показываем эффект автосборщика
        if (bonusCoins > 0) {
            showSpecialEffect(`+${bonusCoins} монет (автосборщик)`, '#ffd700');
        }
    }
}

// Обновляем функцию инициализации
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    updateDisplay();
    updateUpgradeCosts();
    addResetButton();
    initializeBoosts(); // Инициализация бустов
    initializeAchievements(); // Инициализация ачивок
    initializeSkills(); // Инициализация скиллов
    initializeSkins(); // Инициализация скинов
    initializeLeaderboard(); // Инициализация таблицы лидеров
    
    // Запускаем таймеры
    setInterval(autoClick, 1000); // Автоклик каждую секунду
    setInterval(updateCPS, 1000); // Обновление CPS каждую секунду
    setInterval(saveGame, 5000); // Автосохранение каждые 5 секунд
    setInterval(updateAdButton, 1000); // Обновление кнопки рекламы каждую секунду
    setInterval(updateBoostsDisplay, 1000); // Обновление бустов каждую секунду
    setInterval(updateActiveEffects, 1000); // Обновление активных эффектов
    setInterval(updatePlayTime, 1000); // Обновление времени игры
    setInterval(checkAchievements, 5000); // Проверка ачивок каждые 5 секунд
    setInterval(updateLeaderboardDisplay, 2000); // Обновление таблицы лидеров каждые 2 секунды
});

// Функция обновления активных эффектов
function updateActiveEffects() {
    const now = Date.now();
    let effectsUpdated = false;
    
    Object.entries(gameState.activeEffects).forEach(([effectName, effect]) => {
        if (effect.active && now >= effect.endTime) {
            effect.active = false;
            effectsUpdated = true;
            showNotification(`Эффект "${effectName}" закончился`, 'info');
        }
    });
    
    if (effectsUpdated) {
        updateDisplay();
        saveGame();
    }
}

// Сброс дневного лимита рекламы
function resetDailyLimits() {
    const now = new Date();
    const lastReset = new Date(gameState.lastDailyReset || 0);
    
    if (now.getDate() !== lastReset.getDate() || now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
        gameState.adsWatched = 0;
        gameState.lastDailyReset = now.getTime();
        saveGame();
    }
}


// Определения ачивок
const achievementDefinitions = {
    firstClick: { name: 'Первый клик', description: 'Сделать первый клик', reward: { coins: 10 }, icon: '👆' },
    hundredClicks: { name: 'Сотня кликов', description: 'Сделать 100 кликов', reward: { coins: 50 }, icon: '💯' },
    thousandClicks: { name: 'Тысяча кликов', description: 'Сделать 1000 кликов', reward: { coins: 100, gems: 1 }, icon: '🔥' },
    clickMaster: { name: 'Мастер кликов', description: 'Сделать 10000 кликов', reward: { coins: 500, gems: 5 }, icon: '⚡' },
    clickLegend: { name: 'Легенда кликов', description: 'Сделать 100000 кликов', reward: { coins: 1000, gems: 10 }, icon: '👑' },
    firstPoints: { name: 'Первые очки', description: 'Набрать 100 очков', reward: { coins: 25 }, icon: '🎯' },
    thousandPoints: { name: 'Тысячник', description: 'Набрать 1000 очков', reward: { coins: 75 }, icon: '📈' },
    millionaire: { name: 'Миллионер', description: 'Набрать 1000000 очков', reward: { coins: 200, gems: 2 }, icon: '💰' },
    billionaire: { name: 'Миллиардер', description: 'Набрать 1000000000 очков', reward: { coins: 1000, gems: 10 }, icon: '💎' },
    firstUpgrade: { name: 'Первое улучшение', description: 'Купить любое улучшение', reward: { coins: 30 }, icon: '⬆️' },
    collector: { name: 'Коллекционер', description: 'Купить 10 улучшений', reward: { coins: 100, gems: 1 }, icon: '📦' },
    maximalist: { name: 'Максималист', description: 'Прокачать улучшение до 10 уровня', reward: { coins: 300, gems: 3 }, icon: '🔝' },
    firstBoost: { name: 'Первый буст', description: 'Купить любой буст', reward: { coins: 50 }, icon: '🚀' },
    boostLover: { name: 'Любитель бустов', description: 'Купить 5 разных бустов', reward: { coins: 150, gems: 2 }, icon: '💫' },
    boostMaster: { name: 'Мастер бустов', description: 'Купить все доступные бусты', reward: { coins: 1000, gems: 15 }, icon: '🌟' },
    hourPlayed: { name: 'Час игры', description: 'Играть 1 час', reward: { coins: 100 }, icon: '⏰' },
    dayPlayed: { name: 'День игры', description: 'Играть 24 часа', reward: { coins: 500, gems: 5 }, icon: '📅' },
    weekPlayed: { name: 'Неделя игры', description: 'Играть 7 дней подряд', reward: { coins: 1000, gems: 10 }, icon: '🗓️' },
    criticalMaster: { name: 'Критический мастер', description: 'Нанести 100 критических ударов', reward: { coins: 200, gems: 2 }, icon: '💥' },
    adGuru: { name: 'Рекламный гуру', description: 'Посмотреть 50 рекламных роликов', reward: { coins: 300, gems: 5 }, icon: '📺' }
};

// Определения скиллов
const skillDefinitions = {
    // Пассивные скиллы
    strength: { name: 'Сила удара', description: '+1% урона за уровень', maxLevel: 50, type: 'passive', icon: '💪' },
    speed: { name: 'Скорость', description: '+2% автоклика за уровень', maxLevel: 25, type: 'passive', icon: '⚡' },
    luck: { name: 'Удача', description: '+0.5% крита за уровень', maxLevel: 20, type: 'passive', icon: '🍀' },
    magnetism: { name: 'Магнетизм', description: '+1% монет за уровень', maxLevel: 30, type: 'passive', icon: '🧲' },
    endurance: { name: 'Выносливость', description: '+2% длительности бустов', maxLevel: 25, type: 'passive', icon: '🛡️' },
    
    // Активные скиллы
    berserk: { name: 'Берсерк', description: 'x5 урона на 30с', cost: 3, cooldown: 300000, type: 'active', icon: '😡' },
    goldenTouch: { name: 'Золотое касание', description: 'x10 монет на 60с', cost: 5, cooldown: 600000, type: 'active', icon: '✨' },
    timeLoop: { name: 'Временная петля', description: 'Останавливает время на 15с', cost: 10, cooldown: 1800000, type: 'active', icon: '⏳' }
};

// Определения скинов
const skinDefinitions = {
    classic: { name: 'Классический хомяк', description: 'Стандартный вид', cost: 0, currency: 'free', bonus: {}, rarity: 'common', icon: '🐹' },
    golden: { name: 'Золотой хомяк', description: '+5% монет', cost: 1000, currency: 'coins', bonus: { coinMultiplier: 1.05 }, rarity: 'common', icon: '🟡' },
    pink: { name: 'Розовый хомяк', description: '+3% очков', cost: 800, currency: 'coins', bonus: { pointsMultiplier: 1.03 }, rarity: 'common', icon: '🩷' },
    blue: { name: 'Синий хомяк', description: '+2% скорости', cost: 600, currency: 'coins', bonus: { speedMultiplier: 1.02 }, rarity: 'common', icon: '🔵' },
    green: { name: 'Зеленый хомяк', description: '+1% ко всему', cost: 500, currency: 'coins', bonus: { allMultiplier: 1.01 }, rarity: 'common', icon: '🟢' },
    diamond: { name: 'Алмазный хомяк', description: '+10% ко всему', cost: 50, currency: 'gems', bonus: { allMultiplier: 1.1 }, rarity: 'premium', icon: '💎' },
    rainbow: { name: 'Радужный хомяк', description: '+15% очков', cost: 75, currency: 'gems', bonus: { pointsMultiplier: 1.15 }, rarity: 'premium', icon: '🌈' },
    cosmic: { name: 'Космический хомяк', description: '+20% монет', cost: 100, currency: 'gems', bonus: { coinMultiplier: 1.2 }, rarity: 'premium', icon: '🌌' },
    royal: { name: 'Королевский хомяк', description: '+25% ко всему', cost: 150, currency: 'gems', bonus: { allMultiplier: 1.25 }, rarity: 'premium', icon: '👑' },
    mythic: { name: 'Мифический хомяк', description: '+50% ко всему', cost: 500, currency: 'gems', bonus: { allMultiplier: 1.5 }, rarity: 'legendary', icon: '✨' },
    veteran: { name: 'Ветеран', description: '+5% опыта', cost: 0, currency: 'achievement', bonus: { expMultiplier: 1.05 }, rarity: 'exclusive', icon: '🥉', requirement: 'clickLegend' },
    master: { name: 'Мастер', description: '+10% опыта', cost: 0, currency: 'achievement', bonus: { expMultiplier: 1.1 }, rarity: 'exclusive', icon: '🥈', requirement: 'allClickAchievements' },
    legend: { name: 'Легенда', description: '+25% ко всему', cost: 0, currency: 'achievement', bonus: { allMultiplier: 1.25 }, rarity: 'exclusive', icon: '🥇', requirement: 'allAchievements' }
};

// Функции для работы с опытом и уровнями
function addExperience(amount) {
    gameState.experience += amount;
    
    // Проверяем повышение уровня
    const requiredExp = gameState.level * 100;
    if (gameState.experience >= requiredExp) {
        gameState.level++;
        gameState.skillPoints++;
        gameState.experience -= requiredExp;
        
        showSpecialEffect(`УРОВЕНЬ ${gameState.level}!`, '#4CAF50');
        showNotification(`Поздравляем! Вы достигли ${gameState.level} уровня! Получено 1 очко скилла.`, 'success');
    }
}

// Функции для работы с ачивками
function checkAchievements() {
    Object.entries(achievementDefinitions).forEach(([achievementId, achievement]) => {
        if (gameState.achievements[achievementId]) return; // Уже выполнено
        
        let completed = false;
        
        switch(achievementId) {
            case 'firstClick':
                completed = gameState.totalClicks >= 1;
                break;
            case 'hundredClicks':
                completed = gameState.totalClicks >= 100;
                break;
            case 'thousandClicks':
                completed = gameState.totalClicks >= 1000;
                break;
            case 'clickMaster':
                completed = gameState.totalClicks >= 10000;
                break;
            case 'clickLegend':
                completed = gameState.totalClicks >= 100000;
                break;
            case 'firstPoints':
                completed = gameState.score >= 100;
                break;
            case 'thousandPoints':
                completed = gameState.score >= 1000;
                break;
            case 'millionaire':
                completed = gameState.score >= 1000000;
                break;
            case 'billionaire':
                completed = gameState.score >= 1000000000;
                break;
            case 'firstUpgrade':
                completed = Object.values(gameState.upgrades).some(upgrade => upgrade.level > 0);
                break;
            case 'collector':
                const totalUpgrades = Object.values(gameState.upgrades).reduce((sum, upgrade) => sum + upgrade.level, 0);
                completed = totalUpgrades >= 10;
                break;
            case 'maximalist':
                completed = Object.values(gameState.upgrades).some(upgrade => upgrade.level >= 10);
                break;
            case 'firstBoost':
                completed = Object.values(gameState.permanentBoosts).some(boost => boost > 0);
                break;
            case 'boostLover':
                const boughtBoosts = Object.values(gameState.permanentBoosts).filter(boost => boost > 0).length;
                completed = boughtBoosts >= 5;
                break;
            case 'boostMaster':
                const allBoosts = Object.keys(gameState.permanentBoosts).length;
                const boughtAllBoosts = Object.values(gameState.permanentBoosts).filter(boost => boost > 0).length;
                completed = boughtAllBoosts >= allBoosts;
                break;
            case 'hourPlayed':
                completed = gameState.stats.playTime >= 3600000; // 1 час в миллисекундах
                break;
            case 'dayPlayed':
                completed = gameState.stats.playTime >= 86400000; // 24 часа
                break;
            case 'weekPlayed':
                completed = gameState.stats.consecutiveDays >= 7;
                break;
            case 'criticalMaster':
                completed = gameState.stats.criticalHits >= 100;
                break;
            case 'adGuru':
                completed = gameState.adsWatched >= 50;
                break;
        }
        
        if (completed) {
            unlockAchievement(achievementId, achievement);
        }
    });
}

// Разблокировка ачивки
function unlockAchievement(achievementId, achievement) {
    gameState.achievements[achievementId] = true;
    
    // Выдаем награды
    if (achievement.reward.coins) {
        gameState.coins += achievement.reward.coins;
    }
    if (achievement.reward.gems) {
        gameState.gems += achievement.reward.gems;
    }
    
    // Добавляем опыт
    addExperience(50);
    
    showSpecialEffect(`АЧИВКА: ${achievement.name}!`, '#FFD700');
    showNotification(`Ачивка разблокирована: ${achievement.name}!`, 'success');
    
    updateDisplay();
    saveGame();
}

// Функции для работы со скиллами
function upgradeSkill(skillId) {
    const skill = skillDefinitions[skillId];
    if (!skill || skill.type !== 'passive') return;
    
    const currentLevel = gameState.skills[skillId];
    if (currentLevel >= skill.maxLevel) {
        showNotification('Скилл уже на максимальном уровне!', 'error');
        return;
    }
    
    if (gameState.skillPoints < 1) {
        showNotification('Недостаточно очков скиллов!', 'error');
        return;
    }
    
    gameState.skills[skillId]++;
    gameState.skillPoints--;
    
    showNotification(`Скилл "${skill.name}" улучшен до уровня ${gameState.skills[skillId]}!`, 'success');
    updateDisplay();
    saveGame();
}

// Использование активного скилла
function useActiveSkill(skillId) {
    const skill = skillDefinitions[skillId];
    if (!skill || skill.type !== 'active') return;
    
    const now = Date.now();
    const cooldownKey = skillId + 'Cooldown';
    
    if (gameState.skills[cooldownKey] > now) {
        const remaining = Math.ceil((gameState.skills[cooldownKey] - now) / 1000);
        showNotification(`Скилл будет доступен через ${remaining} секунд`, 'error');
        return;
    }
    
    if (gameState.gems < skill.cost) {
        showNotification('Недостаточно кристаллов!', 'error');
        return;
    }
    
    gameState.gems -= skill.cost;
    gameState.skills[cooldownKey] = now + skill.cooldown;
    
    // Применяем эффект скилла
    switch(skillId) {
        case 'berserk':
            gameState.activeEffects.berserk = { active: true, endTime: now + 30000, multiplier: 5 };
            break;
        case 'goldenTouch':
            gameState.activeEffects.goldenTouch = { active: true, endTime: now + 60000, coinMultiplier: 10 };
            break;
        case 'timeLoop':
            // Временная петля - останавливает все таймеры на 15 секунд
            Object.values(gameState.activeEffects).forEach(effect => {
                if (effect.active && effect.endTime > now) {
                    effect.endTime += 15000;
                }
            });
            break;
    }
    
    showNotification(`Активирован скилл: ${skill.name}!`, 'success');
    updateDisplay();
    saveGame();
}

// Функции для работы со скинами
function buySkin(skinId) {
    const skin = skinDefinitions[skinId];
    if (!skin) return;
    
    if (gameState.unlockedSkins.includes(skinId)) {
        showNotification('Скин уже куплен!', 'error');
        return;
    }
    
    // Проверяем требования для эксклюзивных скинов
    if (skin.currency === 'achievement') {
        if (!checkSkinRequirement(skin.requirement)) {
            showNotification('Не выполнены требования для этого скина!', 'error');
            return;
        }
    } else {
        // Проверяем валюту
        const currency = skin.currency === 'coins' ? gameState.coins : gameState.gems;
        if (currency < skin.cost) {
            showNotification(`Недостаточно ${skin.currency === 'coins' ? 'монет' : 'кристаллов'}!`, 'error');
            return;
        }
        
        // Списываем валюту
        if (skin.currency === 'coins') {
            gameState.coins -= skin.cost;
        } else {
            gameState.gems -= skin.cost;
        }
    }
    
    gameState.unlockedSkins.push(skinId);
    showNotification(`Скин "${skin.name}" куплен!`, 'success');
    
    updateDisplay();
    saveGame();
}

// Смена скина
function changeSkin(skinId) {
    if (!gameState.unlockedSkins.includes(skinId)) {
        showNotification('Скин не куплен!', 'error');
        return;
    }
    
    gameState.currentSkin = skinId;
    showNotification(`Скин изменен на "${skinDefinitions[skinId].name}"!`, 'success');
    
    updateDisplay();
    saveGame();
}

// Проверка требований для скинов
function checkSkinRequirement(requirement) {
    switch(requirement) {
        case 'clickLegend':
            return gameState.achievements.clickLegend;
        case 'allClickAchievements':
            return gameState.achievements.firstClick && gameState.achievements.hundredClicks && 
                   gameState.achievements.thousandClicks && gameState.achievements.clickMaster && 
                   gameState.achievements.clickLegend;
        case 'allAchievements':
            return Object.values(gameState.achievements).every(achievement => achievement);
        default:
            return false;
    }
}

// Инициализация новых систем
function initializeAchievements() {
    const achievementsGrid = document.getElementById('achievements-grid');
    if (!achievementsGrid) return;
    
    achievementsGrid.innerHTML = '';
    
    Object.entries(achievementDefinitions).forEach(([achievementId, achievement]) => {
        const achievementElement = createAchievementElement(achievementId, achievement);
        achievementsGrid.appendChild(achievementElement);
    });
}

function createAchievementElement(achievementId, achievement) {
    const achievementDiv = document.createElement('div');
    achievementDiv.className = `achievement-item ${gameState.achievements[achievementId] ? 'completed' : ''}`;
    achievementDiv.id = `achievement-${achievementId}`;
    
    const rewardText = [];
    if (achievement.reward.coins) rewardText.push(`${achievement.reward.coins} монет`);
    if (achievement.reward.gems) rewardText.push(`${achievement.reward.gems} кристаллов`);
    
    achievementDiv.innerHTML = `
        <div class="achievement-icon">${achievement.icon}</div>
        <div class="achievement-info">
            <h4>${achievement.name}</h4>
            <p>${achievement.description}</p>
            <div class="achievement-reward">Награда: ${rewardText.join(', ')}</div>
        </div>
    `;
    
    return achievementDiv;
}

function initializeSkills() {
    const passiveSkillsGrid = document.getElementById('passive-skills-grid');
    const activeSkillsGrid = document.getElementById('active-skills-grid');
    
    if (!passiveSkillsGrid || !activeSkillsGrid) return;
    
    passiveSkillsGrid.innerHTML = '';
    activeSkillsGrid.innerHTML = '';
    
    Object.entries(skillDefinitions).forEach(([skillId, skill]) => {
        const skillElement = createSkillElement(skillId, skill);
        
        if (skill.type === 'passive') {
            passiveSkillsGrid.appendChild(skillElement);
        } else {
            activeSkillsGrid.appendChild(skillElement);
        }
    });
}

function createSkillElement(skillId, skill) {
    const skillDiv = document.createElement('div');
    skillDiv.className = `skill-item ${skill.type === 'active' ? 'active-skill' : ''}`;
    skillDiv.id = `skill-${skillId}`;
    
    if (skill.type === 'passive') {
        const currentLevel = gameState.skills[skillId] || 0;
        const maxLevel = skill.maxLevel;
        
        skillDiv.innerHTML = `
            <div class="skill-info">
                <h4>${skill.icon} ${skill.name}</h4>
                <p>${skill.description}</p>
                <span class="skill-level">Ур. ${currentLevel}/${maxLevel}</span>
            </div>
            <button class="skill-btn" onclick="upgradeSkill('${skillId}')" ${currentLevel >= maxLevel || gameState.skillPoints < 1 ? 'disabled' : ''}>
                ${currentLevel >= maxLevel ? 'МАКС' : 'Улучшить'}
            </button>
        `;
    } else {
        const cooldownKey = skillId + 'Cooldown';
        const isOnCooldown = gameState.skills[cooldownKey] > Date.now();
        const cooldownText = isOnCooldown ? 
            `${Math.ceil((gameState.skills[cooldownKey] - Date.now()) / 1000)}с` : 
            'Готов';
        
        skillDiv.innerHTML = `
            <div class="skill-info">
                <h4>${skill.icon} ${skill.name}</h4>
                <p>${skill.description}</p>
                <span class="skill-cost">Стоимость: ${skill.cost} кристаллов</span>
                <div class="skill-cooldown">Кулдаун: ${cooldownText}</div>
            </div>
            <button class="skill-btn" onclick="useActiveSkill('${skillId}')" ${isOnCooldown || gameState.gems < skill.cost ? 'disabled' : ''}>
                Использовать
            </button>
        `;
    }
    
    return skillDiv;
}

function initializeSkins() {
    const skinsGrid = document.getElementById('skins-grid');
    if (!skinsGrid) return;
    
    skinsGrid.innerHTML = '';
    
    Object.entries(skinDefinitions).forEach(([skinId, skin]) => {
        const skinElement = createSkinElement(skinId, skin);
        skinsGrid.appendChild(skinElement);
    });
}

function createSkinElement(skinId, skin) {
    const skinDiv = document.createElement('div');
    const isOwned = gameState.unlockedSkins.includes(skinId);
    const isActive = gameState.currentSkin === skinId;
    const canUnlock = skin.currency === 'achievement' ? checkSkinRequirement(skin.requirement) : true;
    
    skinDiv.className = `skin-item ${skin.rarity} ${isOwned ? 'owned' : ''} ${isActive ? 'active' : ''}`;
    skinDiv.id = `skin-${skinId}`;
    
    let statusText = '';
    let actionButton = '';
    
    if (isActive) {
        statusText = '<div class="skin-status">Активен</div>';
    } else if (isOwned) {
        actionButton = `<button class="skin-btn" onclick="changeSkin('${skinId}')">Надеть</button>`;
    } else if (skin.currency === 'free') {
        statusText = '<div class="skin-status">Бесплатно</div>';
    } else if (skin.currency === 'achievement') {
        if (canUnlock) {
            actionButton = `<button class="skin-btn" onclick="buySkin('${skinId}')">Разблокировать</button>`;
        } else {
            statusText = '<div class="skin-status locked">Заблокирован</div>';
        }
    } else {
        const costText = `${skin.cost} ${skin.currency === 'coins' ? 'монет' : 'кристаллов'}`;
        actionButton = `<button class="skin-btn" onclick="buySkin('${skinId}')">${costText}</button>`;
    }
    
    skinDiv.innerHTML = `
        <div class="skin-preview" style="background: linear-gradient(135deg, #${Math.random().toString(16).substr(2,6)}, #${Math.random().toString(16).substr(2,6)});">
            <div style="font-size: 2rem; line-height: 74px;">${skin.icon}</div>
        </div>
        <div class="skin-info">
            <h4>${skin.name}</h4>
            <p>${skin.description}</p>
        </div>
        ${statusText}
        ${actionButton}
    `;
    
    skinDiv.onclick = () => {
        if (isOwned && !isActive) {
            changeSkin(skinId);
        } else if (!isOwned && skin.currency !== 'achievement') {
            buySkin(skinId);
        }
    };
    
    return skinDiv;
}

// Обновляем функцию updateDisplay
function updateDisplay() {
    scoreElement.textContent = formatNumber(gameState.score);
    coinsElement.textContent = formatNumber(gameState.coins);
    if (gemsElement) gemsElement.textContent = formatNumber(gameState.gems);
    
    // Обновляем новые элементы
    const levelElement = document.getElementById('level');
    const skillPointsElement = document.getElementById('skill-points');
    if (levelElement) levelElement.textContent = gameState.level;
    if (skillPointsElement) skillPointsElement.textContent = gameState.skillPoints;
    
    totalClicksElement.textContent = formatNumber(gameState.totalClicks);
    
    // Вычисляем текущие значения с учетом бустов и скинов
    let currentPointsPerClick = gameState.pointsPerClick;
    currentPointsPerClick += gameState.permanentBoosts.fastPaws;
    currentPointsPerClick += gameState.permanentBoosts.goldenTeeth * 2;
    currentPointsPerClick += gameState.permanentBoosts.diamondClaws * 5;
    
    // Применяем скиллы
    currentPointsPerClick *= (1 + gameState.skills.strength * 0.01);
    
    // Применяем бонусы скинов
    const currentSkin = skinDefinitions[gameState.currentSkin];
    if (currentSkin && currentSkin.bonus.pointsMultiplier) {
        currentPointsPerClick *= currentSkin.bonus.pointsMultiplier;
    }
    if (currentSkin && currentSkin.bonus.allMultiplier) {
        currentPointsPerClick *= currentSkin.bonus.allMultiplier;
    }
    
    let currentAutoPoints = gameState.autoPointsPerSecond;
    currentAutoPoints += gameState.permanentBoosts.energyDrink * 2;
    currentAutoPoints += gameState.permanentBoosts.hamsterFamily * 3;
    currentAutoPoints *= (1 + gameState.permanentBoosts.infiniteEnergy);
    currentAutoPoints *= (1 + gameState.skills.speed * 0.02);
    
    // Применяем бонусы скинов
    if (currentSkin && currentSkin.bonus.speedMultiplier) {
        currentAutoPoints *= currentSkin.bonus.speedMultiplier;
    }
    if (currentSkin && currentSkin.bonus.allMultiplier) {
        currentAutoPoints *= currentSkin.bonus.allMultiplier;
    }
    
    pointsPerClickElement.textContent = formatNumber(currentPointsPerClick * gameState.multiplier);
    autoPointsElement.textContent = formatNumber(currentAutoPoints * gameState.multiplier);
    cpsElement.textContent = gameState.cps;
}

// Обновляем время игры
function updatePlayTime() {
    const now = Date.now();
    const sessionTime = now - gameState.stats.lastPlaySession;
    gameState.stats.playTime += sessionTime;
    gameState.stats.lastPlaySession = now;
    
    // Проверяем последовательные дни
    const today = new Date().toDateString();
    if (gameState.stats.lastDayPlayed !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (gameState.stats.lastDayPlayed === yesterday) {
            gameState.stats.consecutiveDays++;
        } else {
            gameState.stats.consecutiveDays = 1;
        }
        gameState.stats.lastDayPlayed = today;
    }
}


// Определения категорий таблицы лидеров
const leaderboardDefinitions = {
    maxScore: { name: 'Максимальный счет', icon: '🎯', format: 'number', description: 'Самое большое количество очков' },
    maxCoins: { name: 'Максимальные монеты', icon: '💰', format: 'number', description: 'Самое большое количество монет' },
    maxLevel: { name: 'Максимальный уровень', icon: '⭐', format: 'number', description: 'Самый высокий достигнутый уровень' },
    maxClicksPerSession: { name: 'Кликов за сессию', icon: '👆', format: 'number', description: 'Больше всего кликов в одной сессии' },
    fastestMillion: { name: 'Быстрый миллион', icon: '⚡', format: 'time', description: 'Время достижения 1,000,000 очков' },
    fastest10Level: { name: 'Быстрый 10 уровень', icon: '🚀', format: 'time', description: 'Время достижения 10 уровня' },
    maxCPS: { name: 'Максимальный CPS', icon: '💨', format: 'number', description: 'Максимальные клики в секунду' },
    maxCritStreak: { name: 'Серия критов', icon: '💥', format: 'number', description: 'Максимальная серия критических ударов' },
    maxAchievementsPerDay: { name: 'Ачивок за день', icon: '🏆', format: 'number', description: 'Больше всего ачивок за один день' },
    mostExpensivePurchase: { name: 'Дорогая покупка', icon: '💎', format: 'number', description: 'Самая дорогая покупка' },
    longestSession: { name: 'Длинная сессия', icon: '⏰', format: 'time', description: 'Самая длинная игровая сессия' },
    maxConsecutiveDays: { name: 'Дней подряд', icon: '📅', format: 'number', description: 'Больше всего дней подряд' }
};

// Функция обновления рекорда
function updateLeaderboard(category, value, showNotification = true) {
    const currentRecord = gameState.leaderboard[category];
    let isNewRecord = false;
    
    if (currentRecord.value === null || value > currentRecord.value) {
        isNewRecord = true;
        currentRecord.value = value;
        currentRecord.date = new Date().toISOString();
        currentRecord.session = Date.now();
        
        if (showNotification) {
            const definition = leaderboardDefinitions[category];
            showSpecialEffect(`НОВЫЙ РЕКОРД: ${definition.name}!`, '#FFD700');
            showNotification(`Новый рекорд: ${definition.name} - ${formatLeaderboardValue(value, definition.format)}!`, 'success');
        }
        
        saveGame();
    }
    
    return isNewRecord;
}

// Функция проверки рекордов
function checkLeaderboardRecords() {
    // Проверяем максимальный счет
    updateLeaderboard('maxScore', gameState.score, false);
    
    // Проверяем максимальные монеты
    updateLeaderboard('maxCoins', gameState.coins, false);
    
    // Проверяем максимальный уровень
    updateLeaderboard('maxLevel', gameState.level, false);
    
    // Проверяем клики за сессию
    updateLeaderboard('maxClicksPerSession', gameState.stats.sessionClicks, false);
    
    // Проверяем максимальный CPS
    updateLeaderboard('maxCPS', gameState.cps, false);
    
    // Проверяем серию критов
    updateLeaderboard('maxCritStreak', gameState.stats.maxCritStreak, false);
    
    // Проверяем последовательные дни
    updateLeaderboard('maxConsecutiveDays', gameState.stats.consecutiveDays, false);
    
    // Проверяем ачивки за день
    const today = new Date().toDateString();
    if (gameState.stats.lastAchievementDay === today) {
        updateLeaderboard('maxAchievementsPerDay', gameState.stats.achievementsToday, false);
    }
    
    // Проверяем длительность сессии
    const sessionDuration = Date.now() - gameState.stats.sessionStartTime;
    updateLeaderboard('longestSession', sessionDuration, false);
    
    // Проверяем быстрые достижения
    if (gameState.score >= 1000000 && !gameState.leaderboard.fastestMillion.value) {
        const timeToMillion = Date.now() - gameState.stats.sessionStartTime;
        updateLeaderboard('fastestMillion', timeToMillion);
    }
    
    if (gameState.level >= 10 && !gameState.leaderboard.fastest10Level.value) {
        const timeTo10Level = Date.now() - gameState.stats.sessionStartTime;
        updateLeaderboard('fastest10Level', timeTo10Level);
    }
}

// Функция форматирования значений таблицы лидеров
function formatLeaderboardValue(value, format) {
    if (value === null || value === undefined) return 'Не установлен';
    
    switch(format) {
        case 'time':
            return formatTime(value);
        case 'number':
            return formatNumber(value);
        default:
            return value.toString();
    }
}

// Функция форматирования времени
function formatTime(milliseconds) {
    if (!milliseconds) return 'Не установлен';
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
        return `${hours}ч ${minutes % 60}м ${seconds % 60}с`;
    } else if (minutes > 0) {
        return `${minutes}м ${seconds % 60}с`;
    } else {
        return `${seconds}с`;
    }
}

// Инициализация таблицы лидеров
function initializeLeaderboard() {
    const leaderboardGrid = document.getElementById('leaderboard-grid');
    if (!leaderboardGrid) return;
    
    leaderboardGrid.innerHTML = '';
    
    Object.entries(leaderboardDefinitions).forEach(([category, definition]) => {
        const leaderboardElement = createLeaderboardElement(category, definition);
        leaderboardGrid.appendChild(leaderboardElement);
    });
}

// Создание элемента таблицы лидеров
function createLeaderboardElement(category, definition) {
    const leaderboardDiv = document.createElement('div');
    leaderboardDiv.className = 'leaderboard-item';
    leaderboardDiv.id = `leaderboard-${category}`;
    
    const record = gameState.leaderboard[category];
    const formattedValue = formatLeaderboardValue(record.value, definition.format);
    const formattedDate = record.date ? new Date(record.date).toLocaleDateString() : 'Никогда';
    
    // Вычисляем прогресс до следующего рекорда (примерный)
    let progress = 0;
    let currentValue = 0;
    
    switch(category) {
        case 'maxScore':
            currentValue = gameState.score;
            break;
        case 'maxCoins':
            currentValue = gameState.coins;
            break;
        case 'maxLevel':
            currentValue = gameState.level;
            break;
        case 'maxClicksPerSession':
            currentValue = gameState.stats.sessionClicks;
            break;
        case 'maxCPS':
            currentValue = gameState.cps;
            break;
        case 'maxCritStreak':
            currentValue = gameState.stats.critStreak;
            break;
        case 'maxConsecutiveDays':
            currentValue = gameState.stats.consecutiveDays;
            break;
        case 'longestSession':
            currentValue = Date.now() - gameState.stats.sessionStartTime;
            break;
    }
    
    if (record.value > 0) {
        progress = Math.min(100, (currentValue / record.value) * 100);
    }
    
    leaderboardDiv.innerHTML = `
        <div class="leaderboard-icon">${definition.icon}</div>
        <div class="leaderboard-info">
            <h4>${definition.name}</h4>
            <p>${definition.description}</p>
            <div class="leaderboard-value">${formattedValue}</div>
            <div class="leaderboard-date">Установлен: ${formattedDate}</div>
        </div>
        <div class="leaderboard-progress">
            <div class="leaderboard-progress-bar" style="width: ${progress}%"></div>
        </div>
    `;
    
    return leaderboardDiv;
}

// Обновление отображения таблицы лидеров
function updateLeaderboardDisplay() {
    Object.entries(leaderboardDefinitions).forEach(([category, definition]) => {
        const element = document.getElementById(`leaderboard-${category}`);
        if (!element) return;
        
        const record = gameState.leaderboard[category];
        const formattedValue = formatLeaderboardValue(record.value, definition.format);
        const formattedDate = record.date ? new Date(record.date).toLocaleDateString() : 'Никогда';
        
        const valueElement = element.querySelector('.leaderboard-value');
        const dateElement = element.querySelector('.leaderboard-date');
        const progressBar = element.querySelector('.leaderboard-progress-bar');
        
        if (valueElement) valueElement.textContent = formattedValue;
        if (dateElement) dateElement.textContent = `Установлен: ${formattedDate}`;
        
        // Обновляем прогресс
        let progress = 0;
        let currentValue = 0;
        
        switch(category) {
            case 'maxScore':
                currentValue = gameState.score;
                break;
            case 'maxCoins':
                currentValue = gameState.coins;
                break;
            case 'maxLevel':
                currentValue = gameState.level;
                break;
            case 'maxClicksPerSession':
                currentValue = gameState.stats.sessionClicks;
                break;
            case 'maxCPS':
                currentValue = gameState.cps;
                break;
            case 'maxCritStreak':
                currentValue = gameState.stats.critStreak;
                break;
            case 'maxConsecutiveDays':
                currentValue = gameState.stats.consecutiveDays;
                break;
            case 'longestSession':
                currentValue = Date.now() - gameState.stats.sessionStartTime;
                break;
        }
        
        if (record.value > 0) {
            progress = Math.min(100, (currentValue / record.value) * 100);
        }
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    });
}

// Сброс таблицы лидеров
function resetLeaderboard() {
    if (!confirm('Вы уверены, что хотите сбросить все рекорды? Это действие нельзя отменить!')) {
        return;
    }
    
    // Сбрасываем все рекорды
    Object.keys(gameState.leaderboard).forEach(category => {
        gameState.leaderboard[category] = { value: category === 'maxLevel' ? 1 : 0, date: null, session: 0 };
    });
    
    // Обновляем отображение
    updateLeaderboardDisplay();
    saveGame();
    
    showNotification('Все рекорды сброшены!', 'success');
}

// Обновляем функцию clickHamster для учета статистики
function updateClickStatistics(isCritical = false) {
    gameState.stats.sessionClicks++;
    
    if (isCritical) {
        gameState.stats.critStreak++;
        gameState.stats.maxCritStreak = Math.max(gameState.stats.maxCritStreak, gameState.stats.critStreak);
    } else {
        gameState.stats.critStreak = 0;
    }
}

// Обновляем функцию разблокировки ачивок
function unlockAchievement(achievementId, achievement) {
    gameState.achievements[achievementId] = true;
    
    // Обновляем статистику ачивок
    const today = new Date().toDateString();
    if (gameState.stats.lastAchievementDay !== today) {
        gameState.stats.achievementsToday = 1;
        gameState.stats.lastAchievementDay = today;
    } else {
        gameState.stats.achievementsToday++;
    }
    
    // Выдаем награды
    if (achievement.reward.coins) {
        gameState.coins += achievement.reward.coins;
    }
    if (achievement.reward.gems) {
        gameState.gems += achievement.reward.gems;
    }
    
    // Добавляем опыт
    addExperience(50);
    
    showSpecialEffect(`АЧИВКА: ${achievement.name}!`, '#FFD700');
    showNotification(`Ачивка разблокирована: ${achievement.name}!`, 'success');
    
    updateDisplay();
    saveGame();
}

// Обновляем функцию покупки для отслеживания дорогих покупок
function trackExpensivePurchase(cost) {
    updateLeaderboard('mostExpensivePurchase', cost, false);
}

