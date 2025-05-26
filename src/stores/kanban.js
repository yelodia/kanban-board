import { defineStore } from 'pinia'

// Дефолтные колонки
const DEFAULT_COLUMNS = [
  {
    title: "Todo",
    sort_state: null,
    enabled: true,
    last_edit: null,
    cards: []
  },
  {
    title: "In progress",
    sort_state: null,
    enabled: true,
    last_edit: null,
    cards: []
  },
  {
    title: "Done",
    sort_state: null,
    enabled: true,
    last_edit: null,
    cards: []
  }
]

export const useKanbanStore = defineStore('kanban', {
  state: () => ({
    columns: []
  }),

  getters: {
    getColumns: (state) => state.columns,
    
    getColumnByIndex: (state) => (index) => state.columns[index],
    
    columnsCount: (state) => state.columns.length
  },

  actions: {
    initializeStore() {
      if (this.columns.length === 0) {
        this.columns = [...DEFAULT_COLUMNS]
      }
    },

    addColumn(column) {
      this.columns.push({
        title: column.title || "New Column",
        sort_state: null,
        enabled: true,
        last_edit: null,
        cards: []
      })
    },

    deleteColumn(index) {
      this.columns.splice(index, 1)
    },

    updateColumn(index, updates) {
      if (this.columns[index]) {
        this.columns[index] = {
          ...this.columns[index],
          ...updates,
          last_edit: Date.now()
        }
      }
    },

    addCard(columnIndex, card) {
      if (this.columns[columnIndex]) {
        this.columns[columnIndex].cards.push(card)
        this.columns[columnIndex].last_edit = Date.now()
      }
    },

    clearStore() {
      this.columns = []
    }
  },

  persist: {
    key: 'kanban_columns',
    storage: localStorage,
    paths: ['columns'],
    afterRestore: (ctx) => {
      if (ctx.store.columns.length === 0) {
        ctx.store.initializeStore()
      }
    }
  }
})