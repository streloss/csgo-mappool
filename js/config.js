// Конфигурация карт
const MAPS_CONFIG = {
    maps: [
        {
            id: 'dust2',
            name: 'Dust II',
            description: 'Классическая пустынная карта',
            bannerUrl: 'images/dust2.jpg',
            minSize: '800x450' // рекомендуемый размер
        },
        {
            id: 'mirage',
            name: 'Mirage',
            description: 'Ближневосточная городская карта',
            bannerUrl: 'images/mirage.jpg',
            minSize: '800x450'
        },
        {
            id: 'inferno',
            name: 'Inferno',
            description: 'Итальянская деревня',
            bannerUrl: 'images/inferno.jpg',
            minSize: '800x450'
        }
    ],
    
    // Функция для получения URL картинки с проверкой
    getImageUrl: function(mapId) {
        const map = this.maps.find(m => m.id === mapId);
        if (map) {
            return map.bannerUrl;
        }
        return 'images/default.jpg'; // дефолтная картинка если нет
    },
    
    // Функция для получения всех карт
    getAllMaps: function() {
        return this.maps.map(map => ({
            ...map,
            votes: 0
        }));
    }
};

// Проверка наличия изображений
function checkImages() {
    MAPS_CONFIG.maps.forEach(map => {
        const img = new Image();
        img.onerror = function() {
            console.warn(`Изображение не найдено: ${map.bannerUrl}`);
            map.bannerUrl = 'https://via.placeholder.com/800x450/1a1a2e/ff4655?text=' + encodeURIComponent(map.name);
        };
        img.src = map.bannerUrl;
    });
}

// Запускаем проверку при загрузке
document.addEventListener('DOMContentLoaded', checkImages);
