// Данные карт (4 карты как в CS:GO)
const mapsData = [
    {
        id: 'dust2',
        name: 'Dust II',
        description: 'Классическая пустынная карта',
        bannerUrl: 'https://liquipedia.net/commons/images/thumb/1/12/Csgo_dust2.0.jpg/600px-Csgo_dust2.0.jpg',
        votes: 0
    },
    {
        id: 'mirage',
        name: 'Mirage',
        description: 'Ближневосточная городская карта',
        bannerUrl: 'https://static.wikia.nocookie.net/counterstrike/images/2/25/MirageA.png/revision/latest/scale-to-width-down/1000?cb=20150614153756&path-prefix=ru',
        votes: 0
    },
    {
        id: 'inferno',
        name: 'Inferno',
        description: 'Итальянская деревня',
        bannerUrl: 'https://cdn.steamstatic.com/apps/csgo/images/inferno/bsite1-2.jpg?v=1',
        votes: 0
    }
];

// Глобальные переменные
let votes = {};
let userVote = null;
let animationInProgress = false;

// Проверка авторизации
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userStatus = document.getElementById('user-status');
    const adminLink = document.getElementById('admin-link');
    
    if (isLoggedIn) {
        userStatus.textContent = 'Администратор';
        userStatus.style.color = '#ff4655';
        adminLink.style.display = 'block';
    } else {
        userStatus.textContent = 'Гость';
        userStatus.style.color = '#aaa';
        adminLink.style.display = 'none';
    }
    
    return isLoggedIn;
}

// Загрузка голосов из localStorage
function loadVotes() {
    const savedVotes = localStorage.getItem('mapVotes');
    if (savedVotes) {
        votes = JSON.parse(savedVotes);
    } else {
        // Инициализация голосов
        mapsData.forEach(map => {
            votes[map.id] = 0;
        });
    }
    
    userVote = localStorage.getItem('userVote');
}

// Сохранение голосов в localStorage
function saveVotes() {
    localStorage.setItem('mapVotes', JSON.stringify(votes));
    if (userVote) {
        localStorage.setItem('userVote', userVote);
    }
}

// Загрузка карт
function loadMaps() {
    const mapsContainer = document.getElementById('maps-container');
    mapsContainer.innerHTML = '';
    
    mapsData.forEach(map => {
        const mapCard = document.createElement('div');
        mapCard.className = `map-card ${userVote === map.id ? 'voted' : ''}`;
        
        mapCard.innerHTML = `
            <img src="${map.bannerUrl}" alt="${map.name}" class="map-banner">
            <div class="map-info">
                <div class="map-name">
                    <span>${map.name}</span>
                    <div class="map-votes">
                        <i class="fas fa-vote-yea"></i>
                        <span id="votes-${map.id}">${votes[map.id] || 0}</span>
                    </div>
                </div>
                <p class="map-description">${map.description}</p>
                <div class="map-actions">
                    <button class="vote-btn ${userVote === map.id ? 'voted' : ''}" 
                            onclick="voteForMap('${map.id}')"
                            ${userVote ? 'disabled' : ''}>
                        ${userVote === map.id ? '<i class="fas fa-check"></i> Ваш выбор' : 
                          userVote ? '<i class="fas fa-ban"></i> Уже голосовали' : 
                          '<i class="fas fa-vote-yea"></i> Выбрать эту карту'}
                    </button>
                </div>
            </div>
        `;
        
        mapsContainer.appendChild(mapCard);
    });
    
    updateVoteStats();
    updateVoteChart();
}

// Голосование за карту
function voteForMap(mapId) {
    if (userVote || animationInProgress) return;
    
    userVote = mapId;
    votes[mapId] = (votes[mapId] || 0) + 1;
    
    saveVotes();
    loadMaps();
    
    // Проверяем, не достигли ли мы 10 голосов для анимации
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    if (totalVotes >= 10) {
        showMapSelectionAnimation();
    }
}

// Сброс голосов
document.getElementById('reset-votes-btn')?.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите сбросить все голоса?')) {
        mapsData.forEach(map => {
            votes[map.id] = 0;
        });
        userVote = null;
        
        localStorage.removeItem('mapVotes');
        localStorage.removeItem('userVote');
        
        loadMaps();
    }
});

// Обновление статистики голосования
function updateVoteStats() {
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    document.getElementById('total-votes').textContent = totalVotes;
}

// Обновление диаграммы голосования
function updateVoteChart() {
    const votesChart = document.getElementById('votes-chart');
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    
    votesChart.innerHTML = '';
    
    mapsData.forEach(map => {
        const voteCount = votes[map.id] || 0;
        const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
        
        const voteItem = document.createElement('div');
        voteItem.className = 'vote-item';
        
        voteItem.innerHTML = `
            <div class="vote-map-name">${map.name}</div>
            <div class="vote-bar-container">
                <div class="vote-bar" style="width: ${percentage}%"></div>
            </div>
            <div class="vote-count-text">${voteCount} голосов (${percentage}%)</div>
        `;
        
        votesChart.appendChild(voteItem);
    });
}

// Показать анимацию выбора карты
function showMapSelectionAnimation() {
    if (animationInProgress) return;
    animationInProgress = true;
    
    // Находим карту с максимальным количеством голосов
    let maxVotes = 0;
    let selectedMap = null;
    
    mapsData.forEach(map => {
        if (votes[map.id] > maxVotes) {
            maxVotes = votes[map.id];
            selectedMap = map;
        }
    });
    
    if (!selectedMap) return;
    
    const modal = document.getElementById('map-select-modal');
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    const percentage = Math.round((maxVotes / totalVotes) * 100);
    
    // Устанавливаем данные выбранной карты
    document.getElementById('selected-map-name').textContent = selectedMap.name;
    document.getElementById('selected-map-desc').textContent = selectedMap.description;
    document.getElementById('selected-votes').textContent = maxVotes;
    document.getElementById('vote-percentage').textContent = `${percentage}%`;
    
    // Создаем анимированные карты
    const spinningCards = document.getElementById('spinning-cards');
    spinningCards.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        const card = document.createElement('div');
        card.className = 'spin-card';
        spinningCards.appendChild(card);
    }
    
    // Показываем модальное окно
    modal.style.display = 'flex';
    
    // Запускаем обратный отсчет
    let countdown = 3;
    const countdownElement = document.getElementById('countdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;
        
        if (countdown === 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = '🎉';
        }
    }, 1000);
    
    // Обработчики кнопок
    document.getElementById('close-modal').onclick = () => {
        modal.style.display = 'none';
        animationInProgress = false;
    };
    
    document.getElementById('rematch-btn').onclick = () => {
        modal.style.display = 'none';
        animationInProgress = false;
        
        // Сброс голосов для реванша
        mapsData.forEach(map => {
            votes[map.id] = 0;
        });
        userVote = null;
        
        localStorage.removeItem('mapVotes');
        localStorage.removeItem('userVote');
        
        loadMaps();
    };
    
    // Закрытие по клику вне модального окна
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            animationInProgress = false;
        }
    };
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadVotes();
    loadMaps();
    
    // Проверяем, не нужно ли показать анимацию при загрузке
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    if (totalVotes >= 10) {
        setTimeout(() => {
            showMapSelectionAnimation();
        }, 1000);
    }
});
