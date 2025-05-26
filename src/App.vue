<script setup>
import ActionButton from './components/ActionButton.vue'

const handleSort = () => {
  console.log('Sort clicked')
}

</script>

<template>
  <ActionButton 
      text="Sort"
      icon="sort_asc"
      subtext="Ascending" 
      @click="handleSort"
    />
</template>


