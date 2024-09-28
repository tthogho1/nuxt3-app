<template>
  <button @click="handleClick"
    class="btn btn-primary d-flex align-items-center justify-content-center">
    <Search class="me-2" :size="20" />
  </button>
</template>

<script setup>
import { Search } from 'lucide-vue-next';
import {defineEmits} from 'vue';

const emit = defineEmits(['search-clicked']);
const handleClick = () => {
  emit('search-clicked');
};

</script>

<style scoped>
.btn-primary {
  transition: all 0.3s ease-in-out;
}
.btn-primary:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
