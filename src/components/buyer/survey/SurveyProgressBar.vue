<template>
    <div class="progress-bar">
      <div class="progress" :style="{ width: percentage + '%' }"></div>
    </div>
  </template>
  
  <script setup>
  import { computed, defineProps } from 'vue';
  
  const props = defineProps({
    step: { type: Number, required: true },
    totalSteps: { type: Number, required: true },
  });
  
  const percentage = computed(() => (props.step / props.totalSteps) * 100);
  </script>
  
  <style scoped>
  .progress-bar {
    width: 100%;
    height: 10px;
    background: #e0e0e0;
    margin-bottom: 20px;
    border-radius: 4px;
  }
  .progress {
    height: 100%;
    background: #5bd15f;
    border-radius: 4px;
  }
  </style>
  