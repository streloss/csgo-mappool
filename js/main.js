// Данные карт (изначальные)
const mapsData = [
    {
        id: 'dust2',
        name: 'Dust II',
        description: 'Классическая пустынная карта',
        status: 'active',
        bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 'mirage',
        name: 'Mirage',
        description: 'Ближневосточная городская карта',
        status: 'active',
        bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 'ancient',
        name: 'Ancient',
        description: 'Забытый храм в джунглях',
        status: 'active',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 'anubis',
        name: 'Anubis',
        description: 'Египетская тематика',
        status: 'active',
        bannerUrl: 'https://images.unsplash.com/photo-1533050487297-09b450131914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 'overpass',
        name: 'Overpass',
        description: 'Карта в Берлине',
        status: 'active',
        bannerUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
    }
];

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

// Загрузка карт
function loadMaps() {
    const mapsContainer = document.getElementById('maps-container');
    let maps = JSON.parse(localStorage.getItem('maps')) || mapsData;
    
    mapsContainer.innerHTML = '';
    
    maps.forEach(map => {
        const mapCard = document.createElement('div');
        mapCard.className = 'map-card';
        
        mapCard.innerHTML = `
            <img src="${map.bannerUrl}" alt="${map.name}" class="map-banner">
            <div class="map-info">
                <div class="map-name">
                    <span>${map.name}</span>
                    <span class="map-status status-${map.status}">
                        ${map.status === 'active' ? 'Активна' : 'Неактивна'}
                    </span>
                </div>
                <p class="map-description">${map.description}</p>
            </div>
        `;
        
        mapsContainer.appendChild(mapCard);
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadMaps();
});
