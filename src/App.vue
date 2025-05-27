<script setup>
import { onMounted, computed } from 'vue'
import ActionButton from './components/ActionButton.vue'
import KanbanColumn from './components/KanbanColumn.vue'
import { useKanbanStore } from './stores/kanban'
import { shuffleArray } from './utils/array'

const kanbanStore = useKanbanStore()

onMounted(() => {
	kanbanStore.initializeStore()
})

const shuffleCardsDisabled = computed(() => {
	const totalCardsInEnabledColumns = kanbanStore.columns
		.filter(col => col.enabled)
		.reduce((total, col) => total + col.cards.length, 0)
	
	return totalCardsInEnabledColumns < 2
})

const hasEnabledColumns = computed(() => {
  	return kanbanStore.columnsCount === 0 || 
        kanbanStore.columns.some(col => col.enabled)
})

const shuffleColumns = () => {
  	const shuffledColumns = shuffleArray(kanbanStore.columns)
  	kanbanStore.$patch({
    	columns: shuffledColumns
  	})
}

const shuffleCards = () => {
  	const enabledColumns = kanbanStore.columns
    	.map((col, index) => ({ ...col, originalIndex: index }))
    	.filter(col => col.enabled)
  
  	if (enabledColumns.length === 0) return
  
  	const allCards = []
  	enabledColumns.forEach(col => {
    	allCards.push(...col.cards)
  	})
  
  	const shuffledCards = shuffleArray(allCards)
  
	const updatedColumns = [...kanbanStore.columns]
	enabledColumns.forEach(col => {
		updatedColumns[col.originalIndex] = {
		...updatedColumns[col.originalIndex],
		cards: [],
		sort_state: null,
		last_edit: Date.now()
		}
	})
  
	shuffledCards.forEach(card => {
		const randIndex = Math.floor(Math.random() * enabledColumns.length)
		const targetIndex = enabledColumns[randIndex].originalIndex
		updatedColumns[targetIndex].cards.push(card)
	})
  
	kanbanStore.$patch({
		columns: updatedColumns
	})
}

const toggleEditing = () => {
	const updatedColumns = kanbanStore.columns.map(col => ({
		...col,
		enabled: !hasEnabledColumns.value,
	}))
	
	kanbanStore.$patch({
		columns: updatedColumns
	})
}

</script>

<template>
	<div class="board">
		<div class="board__columns-layout">
			<div class="board__columns-wrapper">
				<KanbanColumn 
				v-for="(column, index) in kanbanStore.columns" 
				:key="index" 
				:column="column" 
				:index="index" 
				/>
			</div>
		</div>
		<div class="board__actions text-center">
			<div class="board__actions-buttons">
				<ActionButton 
					text="New column" 
					icon="add" 
					@click="kanbanStore.addColumn({ title: 'New Column' })" 
				/>
				<ActionButton 
					text="Shuffle columns" 
					icon="shuffle" 
					@click="shuffleColumns"
					:disabled="kanbanStore.columnsCount < 2"
				/>
				<ActionButton 
					text="Shuffle cards" 
					icon="shuffle"
					@click="shuffleCards"
					:disabled="shuffleCardsDisabled"
				/>
				<ActionButton 
					:text="hasEnabledColumns ? 'Disable editing' : 'Unlock columns'" 
					:icon="hasEnabledColumns ? 'lock' : 'unlock'"
					@click="toggleEditing"
					:disabled="kanbanStore.columnsCount == 0"
				/>
			</div>
			<p class="c-grey">Board actions</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.board {
	height: 100vh;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	&__actions {
		padding: 12px 0 0;
	}
	&__actions-buttons {
		display: flex;
		gap: 5px;
		justify-content: center;
	}
	&__columns-layout {
		flex: 1;
		overflow-x: auto;
		overflow-y: hidden;
		display: flex;
		min-height: 0;
	}
	&__columns-wrapper {
		display: flex;
		flex: 1;
		gap: 24px;
		min-width: min-content;
		padding: 24px 24px 12px;
	}
}
</style>