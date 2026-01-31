// DOM Elements
const mapsContainer = document.getElementById('maps-container');
const authBtn = document.getElementById('auth-btn');
const loginModal = document.getElementById('login-modal');
const closeModal = document.querySelector('.close-modal');
const loginForm = document.getElementById('login-form');
const adminLink = document.getElementById('admin-link');
const loginError = document.getElementById('login-error');

// Default maps data
const defaultMaps = [
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

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        authBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Выйти';
        authBtn.onclick = () => auth.signOut();
        adminLink.style.display = 'block';
    } else {
        authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Войти';
        authBtn.onclick = showLoginModal;
        adminLink.style.display = 'none';
    }
});

// Show login modal
function showLoginModal() {
    loginModal.style.display = 'flex';
}

// Close modal
closeModal.addEventListener('click', () => {
    loginModal.style.display = 'none';
    loginError.textContent = '';
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        loginModal.style.display = 'none';
        loginForm.reset();
        loginError.textContent = '';
    } catch (error) {
        loginError.textContent = error.message;
    }
});

// Load maps from Firebase or use defaults
async function loadMaps() {
    try {
        const snapshot = await database.ref('maps').once('value');
        const maps = snapshot.val();
        
        if (maps) {
            displayMaps(Object.values(maps));
        } else {
            // Initialize with default maps if no data exists
            await database.ref('maps').set(defaultMaps.reduce((acc, map, index) => {
                acc[map.id] = map;
                return acc;
            }, {}));
            displayMaps(defaultMaps);
        }
    } catch (error) {
        console.error('Error loading maps:', error);
        displayMaps(defaultMaps);
    }
}

// Display maps
function displayMaps(maps) {
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadMaps();
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
            loginError.textContent = '';
        }
    });
});
