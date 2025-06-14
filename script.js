// Игровые переменные
let gameState = {
    score: 0,
    coins: 0,
    pointsPerClick: 1,
    autoPointsPerSecond: 0,
    multiplier: 1,
    totalClicks: 0,
    clicksThisSecond: 0,
    cps: 0,
    
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
    // Увеличиваем счетчики
    const pointsEarned = gameState.pointsPerClick * gameState.multiplier;
    gameState.score += pointsEarned;
    gameState.coins += Math.floor(pointsEarned / 10); // 1 монета за каждые 10 очков
    gameState.totalClicks++;
    gameState.clicksThisSecond++;
    
    // Показываем эффект клика
    showClickEffect(pointsEarned, event);
    
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

