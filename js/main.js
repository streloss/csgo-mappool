// В начале файла добавьте импорт (если будете использовать config.js)
// Или просто используйте этот массив:

const mapsData = [
    {
        id: 'dust2',
        name: 'Dust II',
        description: 'Классическая пустынная карта',
        bannerUrl: 'images/dust2.jpg',
        votes: 0
    },
    {
        id: 'mirage',
        name: 'Mirage',
        description: 'Ближневосточная городская карта',
        bannerUrl: 'images/mirage.jpg',
        votes: 0
    },
    {
        id: 'inferno',
        name: 'Inferno',
        description: 'Итальянская деревня',
        bannerUrl: 'images/inferno.jpg',
        votes: 0
    }
];

// Добавьте функцию для обработки ошибок загрузки изображений
function handleImageError(imgElement, mapId) {
    console.warn(`Не удалось загрузить изображение для ${mapId}`);
    imgElement.onerror = null; // предотвращаем бесконечный цикл
    imgElement.src = `https://via.placeholder.com/800x450/1a1a2e/ff4655?text=${encodeURIComponent(mapId.toUpperCase())}`;
    imgElement.alt = `Изображение ${mapId} не найдено`;
}
