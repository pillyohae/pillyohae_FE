// src/stores/formStore.js
import { defineStore } from 'pinia';

export const useFormStore = defineStore('formStore', {
  state: () => ({
    // Step 1: 기본 정보
    gender: '',
    age: '',
    height: '',
    weight: '',
    // Step 2: 건강 목표 및 상태
    healthGoals: [],
    healthCondition: '',
    // Step 3: 생활습관
    lifestyle: {
      exercise: '',
      smoking: '',
      sleepQuality: '',
      stressLevel: '',
    },
  }),
});
