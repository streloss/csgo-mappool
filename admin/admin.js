// Данные для входа
const ADMIN_CREDENTIALS = {
    login: 'admin',
    password: 'admin18'
};

// Данные карт по умолчанию
const DEFAULT_MAPS = [
    {
        id: 'dust2',
        name: 'Dust II',
        description: 'Классическая пустынная карта',
        bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'mirage',
        name: 'Mirage',
        description: 'Ближневосточная городская карта',
        bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'inferno',
        name: 'Inferno',
        description: 'Итальянская деревня',
        bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    }
];

// DOM Elements
const authContainer = document.getElementById('auth-container');
const logoutBtn = document.getElementById('logout-btn');

// Проверка авторизации
function checkAdminAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showLoginForm();
    } else {
        showAdminPanel();
    }
}

// Показать форму входа
function showLoginForm() {
    authContainer.innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <h2><i class="fas fa-lock"></i> Вход в панель управления</h2>
                <form id="login-form">
                    <div class="form-group">
                        <label for="username">Логин:</label>
                        <input type="text" id="username" required autocomplete="off" placeholder="admin">
                    </div>
                    <div class="form-group">
                        <label for="password">Пароль:</label>
                        <input type="password" id="password" required autocomplete="off" placeholder="admin18">
                    </div>
                    <button type="submit" class="btn">
                        <i class="fas fa-sign-in-alt"></i> Войти
                    </button>
                </form>
                <p id="login-error" class="error-message"></p>
            </div>
        </div>
    `;
    
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
            localStorage.setItem('isLoggedIn', 'true');
            showAdminPanel();
        } else {
            loginError.textContent = 'Неверный логин или пароль!';
        }
    });
}

// Показать панель управления
function showAdminPanel() {
    let maps = JSON.parse(localStorage.getItem('adminMaps')) || DEFAULT_MAPS;
    
    authContainer.innerHTML = `
        <section class="admin-hero">
            <h2>Управление картами</h2>
            <p>Настройте карты для голосования</p>
        </section>

        <div id="admin-maps-container" class="admin-maps-grid">
            <!-- Карты будут загружены здесь -->
        </div>

        <section class="add-map-section">
            <h3><i class="fas fa-plus-circle"></i> Добавить новую карту</h3>
            <p class="section-description">Максимум 4 карты как в CS:GO. Текущее количество: ${maps.length}/4</p>
            <form id="add-map-form" ${maps.length >= 4 ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>
                <div class="form-row">
                    <div class="form-group">
                        <label for="new-map-name">Название карты:</label>
                        <input type="text" id="new-map-name" required ${maps.length >= 4 ? 'disabled' : ''}>
                    </div>
                    <div class="form-group">
                        <label for="new-map-id">ID карты (латинскими):</label>
                        <input type="text" id="new-map-id" required ${maps.length >= 4 ? 'disabled' : ''}>
                    </div>
                </div>
                <div class="form-group">
                    <label for="new-map-description">Описание:</label>
                    <textarea id="new-map-description" rows="3" required ${maps.length >= 4 ? 'disabled' : ''}></textarea>
                </div>
                <div class="form-group">
                    <label for="new-map-banner">URL баннера:</label>
                    <input type="url" id="new-map-banner" required ${maps.length >= 4 ? 'disabled' : ''}>
                </div>
                <button type="submit" class="btn" ${maps.length >= 4 ? 'disabled' : ''}>
                    <i class="fas fa-plus"></i> Добавить карту
                </button>
            </form>
            ${maps.length >= 4 ? '<p class="warning">Достигнут лимит в 4 карты. Удалите карту чтобы добавить новую.</p>' : ''}
        </section>

        <section class="system-controls">
            <h3><i class="fas fa-cog"></i> Управление системой</h3>
            <div class="control-buttons">
                <button id="reset-all-btn" class="btn btn-warning">
                    <i class="fas fa-trash-alt"></i> Сбросить все голоса
                </button>
                <button id="reset-maps-btn" class="btn btn-danger">
                    <i class="fas fa-undo"></i> Сбросить карты по умолчанию
                </button>
            </div>
        </section>
    `;
    
    displayAdminMaps(maps);
    
    const addMapForm = document.getElementById('add-map-form');
    if (maps.length < 4) {
        addMapForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const mapName = document.getElementById('new-map-name').value;
            const mapId = document.getElementById('new-map-id').value.toLowerCase().replace(/\s+/g, '_');
            const description = document.getElementById('new-map-description').value;
            const bannerUrl = document.getElementById('new-map-banner').value;
            
            if (!mapName || !mapId || !description || !bannerUrl) {
                alert('Пожалуйста, заполните все поля.');
                return;
            }
            
            if (maps.some(map => map.id === mapId)) {
                alert('Карта с таким ID уже существует!');
                return;
            }
            
            const newMap = {
                id: mapId,
                name: mapName,
                description: description,
                bannerUrl: bannerUrl
            };
            
            maps.push(newMap);
            localStorage.setItem('adminMaps', JSON.stringify(maps));
            
            addMapForm.reset();
            displayAdminMaps(maps);
            
            alert('Новая карта успешно добавлена!');
        });
    }
    
    // Кнопка сброса голосов
    document.getElementById('reset-all-btn').addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите сбросить ВСЕ голоса пользователей?')) {
            localStorage.removeItem('mapVotes');
            localStorage.removeItem('userVote');
            alert('Все голоса сброшены!');
        }
    });
    
    // Кнопка сброса карт по умолчанию
    document.getElementById('reset-maps-btn').addEventListener('click', () => {
        if (confirm('Вы уверены? Все текущие карты будут заменены на стандартные.')) {
            localStorage.setItem('adminMaps', JSON.stringify(DEFAULT_MAPS));
            displayAdminMaps(DEFAULT_MAPS);
            alert('Карты сброшены к стандартным!');
        }
    });
}

// Отображение карт в панели управления
function displayAdminMaps(maps) {
    const adminMapsContainer = document.getElementById('admin-maps-container');
    adminMapsContainer.innerHTML = '';
    
    maps.forEach(map => {
        const mapCard = document.createElement('div');
        mapCard.className = 'admin-map-card';
        mapCard.id = `map-${map.id}`;
        
        mapCard.innerHTML = `
            <div class="admin-map-header">
                <div class="admin-map-name">
                    <i class="fas fa-map-marker-alt"></i> ${map.name}
                </div>
                <div class="admin-map-actions">
                    <button class="action-btn btn-save" onclick="saveMap('${map.id}')" title="Сохранить">
                        <i class="fas fa-save"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteMap('${map.id}')" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <form class="admin-map-form" id="form-${map.id}">
                <div class="form-row">
                    <div class="admin-form-group">
                        <label>ID карты:</label>
                        <input type="text" value="${map.id}" disabled>
                    </div>
                </div>
                <div class="admin-form-group">
                    <label>Название:</label>
                    <input type="text" value="${map.name}" id="name-${map.id}" required>
                </div>
                <div class="admin-form-group">
                    <label>Описание:</label>
                    <textarea id="desc-${map.id}" required>${map.description}</textarea>
                </div>
                <div class="admin-form-group">
                    <label>URL баннера:</label>
                    <input type="url" value="${map.bannerUrl}" id="banner-${map.id}" required>
                </div>
            </form>
        `;
        
        adminMapsContainer.appendChild(mapCard);
    });
}

// Сохранение изменений карты
function saveMap(mapId) {
    const form = document.getElementById(`form-${mapId}`);
    
    if (!form.checkValidity()) {
        alert('Пожалуйста, заполните все поля правильно.');
        return;
    }
    
    const updatedMap = {
        id: mapId,
        name: document.getElementById(`name-${mapId}`).value,
        description: document.getElementById(`desc-${mapId}`).value,
        bannerUrl: document.getElementById(`banner-${mapId}`).value
    };
    
    let maps = JSON.parse(localStorage.getItem('adminMaps')) || DEFAULT_MAPS;
    const mapIndex = maps.findIndex(map => map.id === mapId);
    
    if (mapIndex !== -1) {
        maps[mapIndex] = updatedMap;
        localStorage.setItem('adminMaps', JSON.stringify(maps));
        alert('Карта успешно обновлена!');
    }
}

// Удаление карты
function deleteMap(mapId) {
    if (!confirm(`Вы уверены, что хотите удалить карту "${mapId}"?`)) {
        return;
    }
    
    let maps = JSON.parse(localStorage.getItem('adminMaps')) || DEFAULT_MAPS;
    
    if (maps.length <= 1) {
        alert('Должна остаться хотя бы одна карта!');
        return;
    }
    
    maps = maps.filter(map => map.id !== mapId);
    localStorage.setItem('adminMaps', JSON.stringify(maps));
    
    const mapElement = document.getElementById(`map-${mapId}`);
    if (mapElement) {
        mapElement.remove();
    }
    
    alert('Карта успешно удалена!');
    showAdminPanel(); // Перезагружаем панель
}

// Выход из системы
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '../index.html';
});

// Инициализация
document.addEventListener('DOMContentLoaded', checkAdminAuth);
