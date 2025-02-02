<!-- src/components/PersonaSpeechBubble.vue -->
<template>
    <div class="speech-bubble" v-if="messages.length">
      <span>{{ currentMessage }}</span>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
  
  const props = defineProps({
    messages: {
      type: Array,
      default: () => []
    },
    interval: {
      type: Number,
      default: 3000 // 기본 3초 간격
    }
  });
  
  const currentIndex = ref(0);
  const currentMessage = computed(() => props.messages[currentIndex.value]);
  
  let timer = null;
  
  const startTimer = () => {
    if (props.messages.length > 1) {
      timer = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % props.messages.length;
      }, props.interval);
    }
  };
  
  onMounted(() => {
    startTimer();
  });
  
  onBeforeUnmount(() => {
    if (timer) clearInterval(timer);
  });
  
  watch(() => props.messages, (newMessages) => {
    currentIndex.value = 0;
    if (timer) {
      clearInterval(timer);
    }
    if (newMessages.length > 1) {
      startTimer();
    }
  });
  </script>
  
  <style scoped>
  .speech-bubble {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 10;
    pointer-events: none; /* 말풍선에 마우스 이벤트가 걸리지 않도록 */
  }
  </style>
  