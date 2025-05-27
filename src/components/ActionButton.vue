<script setup>
const props = defineProps({
    icon: {
        type: String,
        required: false
    },
    text: {
        type: String,
        required: true
    },
    subtext: {
        type: String,
        required: false
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false
    }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
    if (!props.disabled) {
        emit('click', event)
    }
}
</script>

<template>
    <button class="btn" :disabled="disabled" @click="handleClick">
        <svg v-if="icon" width="16" height="16">
          <use :xlink:href="`#icon_${icon}`" />
        </svg>
        {{ text }}
        <span v-if="subtext" class="c-grey">{{ subtext }}</span>
      </button>
</template>

<style lang="scss" scoped>
.btn {
    border: 0;
    outline: none;
    cursor: pointer;
    height: 26px;
    line-height: 22px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    background: #fff;
    font-weight: 600;
    font-family: "Inter", sans-serif;
    border-radius: 12px;
    padding: 0 5px;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: background 0.1s ease-out;
    white-space: nowrap;
    justify-content: center;
    text-transform: capitalize;
    color: #000;
    &:disabled {
        cursor: default;
        opacity: 0.5;
    }
    &:not(:disabled):hover {
        background: #CED9E3;
    }
    &:not(:disabled):active {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) inset;
    }
    &_blue {
        background: #CED9E3;
        border: 0;
        &:not(:disabled):hover {
            background: #b8c8d6;
        }
    }
    &_lg {
        height: 32px;
        border-radius: 8px;
    }
}
</style>