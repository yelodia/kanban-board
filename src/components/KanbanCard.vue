<script setup>
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { useKanbanStore } from '../stores/kanban'
import ActionButton from './ActionButton.vue'
import { eventBus, EVENTS } from '../utils/eventBus'

// Props
const props = defineProps({
    card: {
        type: Object,
        required: true
    },
    columnIndex: {
        type: Number,
        required: true
    },
    cardIndex: {
        type: Number,
        required: true
    },
    isNew: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['edit-finish'])

// Store
const kanbanStore = useKanbanStore()

const isEditing = ref(props.isNew)
const originalTitle = ref(props.card.title || '')
const originalDescription = ref(props.card.description || 'Add description')
const currentTitle = ref(props.card.title || '')
const currentDescription = ref(props.card.description || 'Add description')

const titleRef = ref(null)
const descRef = ref(null)

const handleReset = (columnIndex) => { // if not undefined, use only for column
    const needHandle = !columnIndex || columnIndex === props.columnIndex
    if (isEditing.value && !props.isNew && needHandle) {
        cancelEditing()
    }
}

onMounted(() => {
    eventBus.on(EVENTS.SHUFFLE_CARDS, handleReset)
    eventBus.on(EVENTS.SHUFFLE_COLUMNS, handleReset)
    eventBus.on(EVENTS.SORT_CARDS, handleReset)
})

onUnmounted(() => {
    eventBus.off(EVENTS.SHUFFLE_CARDS, handleReset)
    eventBus.off(EVENTS.SHUFFLE_COLUMNS, handleReset)
    eventBus.off(EVENTS.SORT_CARDS, handleReset)
})

const hasChanges = computed(() => {
    return currentTitle.value !== originalTitle.value ||
        currentDescription.value !== originalDescription.value
})

const isSaveDisabled = computed(() => !hasChanges.value && !props.isNew)

const startEditing = (event) => {
    event.preventDefault()
    if (isEditing.value) {
        return
    }
    window.getSelection().removeAllRanges()
    isEditing.value = true

    nextTick(() => {
        titleRef.value?.focus()
    })
}

const deleteCard = (event) => {
    if (!isEditing.value) {
        event.preventDefault()
        //eventBus.off(EVENTS.SHUFFLE_CARDS)
        //eventBus.off(EVENTS.SORT_CARDS)
        kanbanStore.deleteCard(props.columnIndex, props.cardIndex)
        emit('edit-finish')
    }
}

const updateCurrentValues = () => {
  currentTitle.value = titleRef.value?.textContent?.trim()
  currentDescription.value = descRef.value?.textContent?.trim()
}

const handleKeydown = (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        if (!isSaveDisabled.value) {
            saveCard()
        }
    }
}

const saveCard = () => {
    updateCurrentValues()

    const finalTitle = currentTitle.value
    const finalDescription = currentDescription.value || 'Add description'

    if (props.isNew) {
        kanbanStore.addCard(props.columnIndex, {
            title: finalTitle,
            description: finalDescription
        })
    } else {
        kanbanStore.updateCard(props.columnIndex, props.cardIndex, {
            title: finalTitle,
            description: finalDescription
        })
    }

    originalTitle.value = finalTitle
    originalDescription.value = finalDescription
    currentTitle.value = finalTitle
    currentDescription.value = finalDescription

    isEditing.value = false
    emit('edit-finish')
}

const cancelEditing = () => {
    if (props.isNew) {
        emit('edit-finish')
    } else {
        currentTitle.value = props.card.title
        currentDescription.value = props.card.description
        originalTitle.value = props.card.title
        originalDescription.value = props.card.description
        titleRef.value.textContent = currentTitle.value
        descRef.value.textContent = currentDescription.value
        isEditing.value = false
    }
}

if (props.isNew) {
    nextTick(() => {
        titleRef.value?.focus()
    })
}
</script>

<template>
    <div class="card" 
        :class="{ 'card_editing': isEditing }" 
        @dblclick="startEditing" 
        @contextmenu="deleteCard"
    >
    
        <div 
            ref="titleRef" 
            class="card__title" 
            :contenteditable="isEditing" 
            @input="updateCurrentValues"
            @keydown="handleKeydown"
        >
            {{ card.title }}
        </div>
    
        <div 
            ref="descRef" 
            class="c-grey" 
            :contenteditable="isEditing" 
            @input="updateCurrentValues" 
            @keydown="handleKeydown"
        >
            {{ card.description }}
        </div>
    
        <div v-if="isEditing" class="card__buttons">
            <ActionButton 
                text="Save changes"
                icon="apply"
                :disabled="isSaveDisabled" 
                @click="saveCard"
            />
    
            <ActionButton 
                text="Cancel"
                icon="cancel"
                @click="cancelEditing" 
            />
        </div>
    
    </div>
</template>

<style lang="scss" scoped>
.card {
    background-color: #fff;
    border-radius: 8px;
    padding: 8px 16px;
    cursor: pointer;
    &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    &_editing {
        box-shadow: 0 0 0 2px #007AFF !important;
        cursor: text;
    }
    &__title {
        font-weight: bold;
    }
    &__buttons {
        display: flex;
        gap: 5px;
        align-items: center;
    }

    > div {
        margin: 8px 0;
    }
}
</style>