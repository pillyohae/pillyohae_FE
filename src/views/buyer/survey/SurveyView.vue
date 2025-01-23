<template>
    <v-app>
      <!-- 공통 네비게이션 바 컴포넌트 -->
    <buyer-navigation-bar />
  
      <v-main>
        <!-- 설문 Form 컴포넌트 -->
        <survey-form :surveys="surveys" @viewDetails="viewDetails" />
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import BuyerNavigationBar from '../BuyerNavigationBar.vue';
  import SurveyForm from '../../../components/buyer/survey/SurveyForm.vue';
  import { ref, onMounted } from 'vue';
  import api from '../../../api/axios';
  
  const surveys = ref([]);
  
  const fetchSurveys = async () => {
    try {
      const response = await api.get('/surveys');
      surveys.value = response.data;
    } catch (error) {
      console.error('설문 목록 조회 실패:', error.message);
    }
  };
  
  const viewDetails = (surveyId) => {
    window.location.href = `/survey/recommendations/${surveyId}`;
  };
  
  onMounted(() => {
    fetchSurveys();
  });
  </script>
  