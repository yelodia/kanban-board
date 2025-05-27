<script setup>
import { onMounted } from 'vue'
import ActionButton from './components/ActionButton.vue'
import KanbanColumn from './components/KanbanColumn.vue'
import { useKanbanStore } from './stores/kanban'

const kanbanStore = useKanbanStore()

onMounted(() => {
	kanbanStore.initializeStore()
})
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
			<ActionButton 
				text="New column" 
				icon="add" 
				@click="kanbanStore.addColumn({ title: 'New Column' })" 
			/>
			<ActionButton 
				text="Shuffle columns" 
				icon="shuffle" 
			/>
			<ActionButton 
				text="Shuffle cards" 
				icon="shuffle" 
			/>
			<ActionButton 
				text="Disable editing" 
				icon="lock" 
			/>
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