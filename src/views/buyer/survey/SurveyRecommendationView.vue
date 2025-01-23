<template>
    <v-app>
      <!-- 내비게이션 바 -->
      <buyer-navigation-bar />
  
      <v-main>
        <survey-recommendation-form :recommendations="recommendations" />
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import api from "../../../api/axios";
  import BuyerNavigationBar from "../BuyerNavigationBar.vue";
  import SurveyRecommendationForm from "../../../components/buyer/survey/SurveyRecommendationForm.vue";
  import { useRoute } from "vue-router";
  
  const recommendations = ref([]);
  const route = useRoute();
  
  // 설문 결과 데이터를 서버에서 가져오는 함수
  const fetchRecommendations = async () => {
    const surveyId = route.params.surveyId;
    try {
      const response = await api.get(`/surveys/${surveyId}/recommendations`);
      recommendations.value = response.data;
    } catch (error) {
      console.error("추천 데이터를 불러오는 데 실패했습니다:", error.response?.data || error.message);
      alert("추천 데이터를 불러오지 못했습니다.");
    }
  };
  
  onMounted(fetchRecommendations);
  </script>
  
  <style>
  /* 스타일 정의 필요 시 추가 */
  </style>
  