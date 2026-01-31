// Данные для входа
const ADMIN_CREDENTIALS = {
    login: 'admin',
    password: 'admin18'
};

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
                        <input type="text" id="username" required autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="password">Пароль:</label>
                        <input type="password" id="password" required autocomplete="off">
                    </div>
                    <button type="submit" class="btn">
                        <i class="fas fa-sign-in-alt"></i> Войти
                    </button>
                </form>
                <p id="login-error" class="error-message"></p>
            </div>
        </div>
    `;
    
    // Обработка формы входа
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
    // Загружаем текущие карты
    let maps = JSON.parse(localStorage.getItem('maps')) || [
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
    
    // Отображаем панель управления
    authContainer.innerHTML = `
        <section class="admin-hero">
            <h2>Управление картами</h2>
            <p>Изменяйте статус и информацию о картах</p>
        </section>

        <div id="admin-maps-container" class="admin-maps-grid">
            <!-- Карты будут загружены здесь -->
        </div>

        <section class="add-map-section">
            <h3><i class="fas fa-plus-circle"></i> Добавить новую карту</h3>
            <form id="add-map-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="new-map-name">Название карты:</label>
                        <input type="text" id="new-map-name" required>
                    </div>
                    <div class="form-group">
                        <label for="new-map-id">ID карты (латинскими):</label>
                        <input type="text" id="new-map-id" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="new-map-description">Описание:</label>
                    <textarea id="new-map-description" rows="3" required></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="new-map-banner">URL баннера:</label>
                        <input type="url" id="new-map-banner" required>
                    </div>
                    <div class="form-group">
                        <label for="new-map-status">Статус:</label>
                        <select id="new-map-status">
                            <option value="active">Активна</option>
                            <option value="inactive">Неактивна</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn">
                    <i class="fas fa-plus"></i> Добавить карту
                </button>
            </form>
        </section>
    `;
    
    // Отображаем карты для редактирования
    displayAdminMaps(maps);
    
    // Обработка формы добавления новой карты
    const addMapForm = document.getElementById('add-map-form');
    addMapForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const mapName = document.getElementById('new-map-name').value;
        const mapId = document.getElementById('new-map-id').value.toLowerCase().replace(/\s+/g, '_');
        const description = document.getElementById('new-map-description').value;
        const bannerUrl = document.getElementById('new-map-banner').value;
        const status = document.getElementById('new-map-status').value;
        
        if (!mapName || !mapId || !description || !bannerUrl) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }
        
        // Проверяем, существует ли уже карта с таким ID
        const existingMaps = JSON.parse(localStorage.getItem('maps')) || [];
        if (existingMaps.some(map => map.id === mapId)) {
            alert('Карта с таким ID уже существует!');
            return;
        }
        
        const newMap = {
            id: mapId,
            name: mapName,
            description: description,
            bannerUrl: bannerUrl,
            status: status
        };
        
        existingMaps.push(newMap);
        localStorage.setItem('maps', JSON.stringify(existingMaps));
        
        // Очищаем форму
        addMapForm.reset();
        
        // Обновляем список карт
        displayAdminMaps(existingMaps);
        
        alert('Новая карта успешно добавлена!');
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
                <div class="admin-map-name">${map.name}</div>
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
                    <div class="admin-form-group">
                        <label>Название:</label>
                        <input type="text" value="${map.name}" id="name-${map.id}" required>
                    </div>
                </div>
                <div class="admin-form-group">
                    <label>Описание:</label>
                    <textarea id="desc-${map.id}" required>${map.description}</textarea>
                </div>
                <div class="form-row">
                    <div class="admin-form-group">
                        <label>URL баннера:</label>
                        <input type="url" value="${map.bannerUrl}" id="banner-${map.id}" required>
                    </div>
                    <div class="admin-form-group">
                        <label>Статус:</label>
                        <select id="status-${map.id}">
                            <option value="active" ${map.status === 'active' ? 'selected' : ''}>Активна</option>
                            <option value="inactive" ${map.status === 'inactive' ? 'selected' : ''}>Неактивна</option>
                        </select>
                    </div>
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
        bannerUrl: document.getElementById(`banner-${mapId}`).value,
        status: document.getElementById(`status-${mapId}`).value
    };
    
    let maps = JSON.parse(localStorage.getItem('maps')) || [];
    const mapIndex = maps.findIndex(map => map.id === mapId);
    
    if (mapIndex !== -1) {
        maps[mapIndex] = updatedMap;
        localStorage.setItem('maps', JSON.stringify(maps));
        alert('Карта успешно обновлена!');
    }
}

// Удаление карты
function deleteMap(mapId) {
    if (!confirm(`Вы уверены, что хотите удалить карту ${mapId}?`)) {
        return;
    }
    
    let maps = JSON.parse(localStorage.getItem('maps')) || [];
    maps = maps.filter(map => map.id !== mapId);
    
    localStorage.setItem('maps', JSON.stringify(maps));
    
    // Удаляем карту из DOM
    const mapElement = document.getElementById(`map-${mapId}`);
    if (mapElement) {
        mapElement.remove();
    }
    
    alert('Карта успешно удалена!');
}

// Выход из системы
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '../index.html';
});

// Инициализация
document.addEventListener('DOMContentLoaded', checkAdminAuth);
