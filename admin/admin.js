// DOM Elements
const adminMapsContainer = document.getElementById('admin-maps-container');
const logoutBtn = document.getElementById('logout-btn');
const addMapForm = document.getElementById('add-map-form');

// Check authentication
auth.onAuthStateChanged((user) => {
    if (user) {
        loadMapsForAdmin();
    } else {
        showAuthMessage();
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            window.location.href = '../index.html';
        })
        .catch((error) => {
            console.error('Logout error:', error);
        });
});

// Load maps for admin panel
async function loadMapsForAdmin() {
    try {
        const snapshot = await database.ref('maps').once('value');
        const maps = snapshot.val();
        
        if (maps) {
            displayAdminMaps(maps);
        }
    } catch (error) {
        console.error('Error loading maps:', error);
        adminMapsContainer.innerHTML = `
            <div class="error-message">
                <p>Ошибка загрузки карт. Пожалуйста, попробуйте позже.</p>
            </div>
        `;
    }
}

// Display maps in admin panel
function displayAdminMaps(maps) {
    adminMapsContainer.innerHTML = '';
    
    Object.entries(maps).forEach(([mapId, map]) => {
        const mapCard = document.createElement('div');
        mapCard.className = 'admin-map-card';
        mapCard.id = `map-${mapId}`;
        
        mapCard.innerHTML = `
            <div class="admin-map-header">
                <div class="admin-map-name">${map.name}</div>
                <div class="admin-map-actions">
                    <button class="action-btn btn-save" onclick="saveMap('${mapId}')" title="Сохранить">
                        <i class="fas fa-save"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteMap('${mapId}')" title="Удалить">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <form class="admin-map-form" id="form-${mapId}">
                <div class="form-row">
                    <div class="admin-form-group">
                        <label>ID карты:</label>
                        <input type="text" value="${mapId}" disabled>
                    </div>
                    <div class="admin-form-group">
                        <label>Название:</label>
                        <input type="text" value="${map.name}" id="name-${mapId}" required>
                    </div>
                </div>
                <div class="admin-form-group">
                    <label>Описание:</label>
                    <textarea id="desc-${mapId}" required>${map.description}</textarea>
                </div>
                <div class="form-row">
                    <div class="admin-form-group">
                        <label>URL баннера:</label>
                        <input type="url" value="${map.bannerUrl}" id="banner-${mapId}" required>
                    </div>
                    <div class="admin-form-group">
                        <label>Статус:</label>
                        <select id="status-${mapId}">
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

// Save map changes
async function saveMap(mapId) {
    const form = document.getElementById(`form-${mapId}`);
    
    if (!form.checkValidity()) {
        alert('Пожалуйста, заполните все поля правильно.');
        return;
    }
    
    const updatedMap = {
        name: document.getElementById(`name-${mapId}`).value,
        description: document.getElementById(`desc-${mapId}`).value,
        bannerUrl: document.getElementById(`banner-${mapId}`).value,
        status: document.getElementById(`status-${mapId}`).value
    };
    
    try {
        await database.ref(`maps/${mapId}`).update(updatedMap);
        alert('Карта успешно обновлена!');
    } catch (error) {
        console.error('Error saving map:', error);
        alert('Ошибка при сохранении карты.');
    }
}

// Delete map
async function deleteMap(mapId) {
    if (!confirm(`Вы уверены, что хотите удалить карту ${mapId}?`)) {
        return;
    }
    
    try {
        await database.ref(`maps/${mapId}`).remove();
        document.getElementById(`map-${mapId}`).remove();
        alert('Карта успешно удалена!');
    } catch (error) {
        console.error('Error deleting map:', error);
        alert('Ошибка при удалении карты.');
    }
}

// Add new map
addMapForm.addEventListener('submit', async (e) => {
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
    
    const newMap = {
        name: mapName,
        description: description,
        bannerUrl: bannerUrl,
        status: status
    };
    
    try {
        await database.ref(`maps/${mapId}`).set(newMap);
        
        // Clear form
        addMapForm.reset();
        
        // Reload maps
        loadMapsForAdmin();
        
        alert('Новая карта успешно добавлена!');
    } catch (error) {
        console.error('Error adding map:', error);
        alert('Ошибка при добавлении карты.');
    }
});

// Show authentication required message
function showAuthMessage() {
    document.querySelector('main').innerHTML = `
        <div class="auth-message">
            <h3><i class="fas fa-lock"></i> Требуется авторизация</h3>
            <p>Для доступа к панели управления необходимо войти в систему.</p>
            <button onclick="window.location.href='../index.html'" class="btn">
                <i class="fas fa-sign-in-alt"></i> Перейти к входу
            </button>
        </div>
    `;
}
