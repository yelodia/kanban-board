<script setup>
import { ref, computed, watch } from 'vue'
import { useKanbanStore } from '../stores/kanban'
import ActionButton from './ActionButton.vue'
import KanbanCard from './KanbanCard.vue'
import { useTimeAgo } from '@vueuse/core'

// Props
const props = defineProps({
    column: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
})

const kanbanStore = useKanbanStore()

const originalTitle = ref(props.column.title)
const titleElement = ref(null)
const isAddingNewCard = ref(false)
const tempNewCard = ref(null)

const cardsCount = computed(() => props.column.cards.length)
const isDisabled = computed(() => !props.column.enabled)

const lastEditTimeAgo = useTimeAgo(() => props.column.last_edit, {
    showSecond: false,
    updateInterval: 30000
})

const handleTitleKeydown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        saveTitle(event)
    }
}

const handleTitleBlur = (event) => {
    event.target.textContent = originalTitle.value
}

const saveTitle = (event) => {
    const newTitle = event.target.textContent.trim()

    if (newTitle && newTitle !== originalTitle.value) {
        kanbanStore.updateColumn(props.index, { title: newTitle })
        originalTitle.value = newTitle
    } else {
        event.target.textContent = originalTitle.value
    }

    event.target.blur()
}

const toggleEditing = () => {
    kanbanStore.updateColumn(props.index, {
        enabled: !props.column.enabled
    })
}

const deleteColumn = () => {
    kanbanStore.deleteColumn(props.index)
}

const addNewCard = () => {
    isAddingNewCard.value = true
    tempNewCard.value = {
        title: '',
        description: 'Add description'
    }
}

const removeTempCard = () => {
    isAddingNewCard.value = false
    tempNewCard.value = null
}

const updateOriginalTitle = () => {
    originalTitle.value = props.column.title
}

watch(() => props.column.title, updateOriginalTitle)
</script>

<template>
    <div class="column" :class="{ 'column_disabled': isDisabled }">
        <div class="column__header">
            <div class="column__counter">
                {{ cardsCount }}
            </div>

            <div 
                ref="titleElement" 
                class="column__title" 
                contenteditable="true" 
                @keydown="handleTitleKeydown" 
                @blur="handleTitleBlur"
            >
                {{ column.title }}
            </div>
            <ActionButton 
                :text="column.enabled ? 'Disable editing' : 'Unlock column'" 
                :icon="column.enabled ? 'lock' : 'unlock'" 
                class="column__ontop" 
                @click="toggleEditing" 
            />
            <ActionButton 
                text="Delete column"
                icon="cancel"
                @click="deleteColumn" 
            />
        </div>
        <div class="column__content">
            <KanbanCard
                v-for="(card, cardIndex) in column.cards"
                :key="cardIndex"
                :card="card"
                :column-index="index"
                :card-index="cardIndex"
            />

            <KanbanCard
                v-if="isAddingNewCard"
                :card="tempNewCard"
                :column-index="index"
                :card-index="column.cards.length"
                :is-new="true"
                @edit-finish="removeTempCard"
            />

            <ActionButton 
                text="New card"
                icon="add"
                class="btn_lg btn_blue"
                @click="addNewCard"
                :disabled="isAddingNewCard" 
            />

            <div v-if="column.last_edit" class="c-grey text-center">
                Last edit {{ lastEditTimeAgo }}
            </div>

        </div>
        <div class="column__footer">
        </div>
    
    </div>
</template>

<style scoped lang="scss">
.column {
    flex: 1 0 400px;
    max-width: 500px;
    background-color: #ECEFF2;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    min-height: 0;
    position: relative;
    &_disabled {
        &:after {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            content: "";
            background: rgba(255, 255, 255, 0.4);
        }
    }
    &__counter {
        font-weight: bold;
        font-size: 12px;
        background: #fff;
        height: 30px;
        width: 30px;
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 50%;
        line-height: 26px;
        text-align: center;
        position: absolute;
        top: -15px;
        left: -15px;
    }
    &__title {
        text-transform: uppercase;
        font-size: 12px;
        flex: 1;
        overflow-wrap: break-word;
        min-width: 0;
        padding-top: 5px;
        font-weight: 500;
        color: #aaa;
    }
    &__footer {
        display: flex;
        padding: 16px;
        gap: 5px;
        justify-content: center;
    }
    &__header {
        display: flex;
        padding: 16px;
        gap: 5px;
    }
    &__content {
        flex: 1;
        padding: 0 16px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    &__ontop {
        position: relative;
        z-index: 1;
    }
}
</style>