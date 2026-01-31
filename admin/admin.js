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

//
