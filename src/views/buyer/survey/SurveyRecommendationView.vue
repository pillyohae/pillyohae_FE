<template>
  <v-app>
    <!-- 내비게이션 바 -->
    <buyer-navigation-bar />

    <v-main>
      <survey-recommendation-form 
        :recommendations="recommendations" 
        :surveyDetails="surveyDetails" 
      />
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
const surveyDetails = ref(null); // 설문 상세 정보 저장
const route = useRoute();

// 추천 제품 불러오기
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

// 설문 상세 정보 불러오기
const fetchSurveyDetails = async () => {
  const surveyId = route.params.surveyId;
  try {
    const response = await api.get(`/surveys/${surveyId}/details`);
    surveyDetails.value = response.data;
  } catch (error) {
    console.error("설문 상세 데이터를 불러오는 데 실패했습니다:", error.response?.data || error.message);
    alert("설문 상세 데이터를 불러오지 못했습니다.");
  }
};

onMounted(async () => {
  await fetchRecommendations();
  await fetchSurveyDetails();
});
</script>
