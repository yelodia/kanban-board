/**
 * Перемешивает массив используя алгоритм Fisher-Yates
 * @param {Array} array - исходный массив
 * @returns {Array} новый перемешанный массив
 */
export const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

/**
 * Группирует элементы массива по ключу
 * @param {Array} array - массив объектов
 * @param {string} key - ключ для группировки
 * @returns {Object} объект с группами
 */
export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = item[key]
        if (!groups[group]) groups[group] = []
        groups[group].push(item)
        return groups
    }, {})
}