<template>
    <v-container>
      <v-row justify="center" class="mb-4">
        <v-card-title class="text-h5 font-weight-bold">
          개선하고 싶은 부분을 순서대로 골라주세요
        </v-card-title>
      </v-row>
  
      <v-row justify="center" class="mb-4">
        <v-col
          v-for="category in categories"
          :key="category"
          cols="6"
          md="3"
          class="d-flex justify-center"
        >
          <v-btn
            :color="selectedCategories.includes(category) ? 'green' : 'grey lighten-2'"
            block
            @click="toggleCategory(category)"
          >
            <span v-if="selectedCategories.includes(category)">
              {{ selectedCategories.indexOf(category) + 1 }}위
            </span>
            {{ category }}
          </v-btn>
        </v-col>
      </v-row>
  
      <v-row justify="center" class="mb-4">
        <p>{{ selectedCategories.length }}/3개 선택 완료</p>
      </v-row>
  
      <v-row justify="center">
        <v-btn
          color="green"
          large
          :disabled="selectedCategories.length !== 3"
          @click="submitSurvey"
        >
          설문 저장하기
        </v-btn>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import api from '../../../api/axios';
  
  const router = useRouter();
  
  const categories = [
    '혈압/혈당',
    '콜레스테롤',
    '간 건강',
    '눈 건강',
    '관절/뼈',
    '장 건강',
    '피로감',
    '수면',
    '스트레스',
  ];
  
  const selectedCategories = ref([]);
  
  const toggleCategory = (category) => {
    const index = selectedCategories.value.indexOf(category);
    if (index > -1) {
      selectedCategories.value.splice(index, 1);
    } else if (selectedCategories.value.length < 3) {
      selectedCategories.value.push(category);
    }
  };
  
  const submitSurvey = async () => {
    try {
      const response = await api.post('/surveys', {
        categories: selectedCategories.value.join(', '),
      });
  
      await api.post(`/surveys/${response.data.surveyId}/recommendations`);
      alert('설문과 추천 상품 생성이 완료되었습니다!');
      router.push('/survey');
    } catch (error) {
      console.error('설문 저장 실패:', error.message);
      alert('설문 저장에 실패했습니다.');
    }
  };
  </script>
  