import mitt from 'mitt'

// Создаем глобальную шину событий
export const eventBus = mitt()

// Типы событий для удобства
export const EVENTS = {
  SHUFFLE_COLUMNS: 'shuffle-columns',
  SHUFFLE_CARDS: 'shuffle-cards',
  SORT_CARDS: 'sort-cards'
}
