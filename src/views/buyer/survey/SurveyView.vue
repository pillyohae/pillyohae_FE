<template>
  <v-app>
    <!-- 공통 네비게이션 바 컴포넌트 -->
    <buyer-navigation-bar />

    <v-main>
      <!-- 설문 Form 컴포넌트 -->
      <survey-form
        :surveys="surveys"
        @viewDetails="viewDetails"
        @deleteSurvey="deleteSurvey"
      />
    </v-main>
  </v-app>
</template>

<script setup>
import BuyerNavigationBar from '../BuyerNavigationBar.vue';
import SurveyForm from '../../../components/buyer/survey/SurveyForm.vue';
import { ref, onMounted } from 'vue';
import api from '../../../api/axios';

const surveys = ref([]);

// 설문 목록 조회
const fetchSurveys = async () => {
  try {
    const response = await api.get('/surveys');
    surveys.value = response.data;
  } catch (error) {
    console.error('설문 목록 조회 실패:', error.message);
  }
};

// 설문 삭제
const deleteSurvey = async (surveyId) => {
  try {
    await api.delete(`/surveys/${surveyId}`);
    surveys.value = surveys.value.filter((survey) => survey.surveyId !== surveyId);
    alert('설문이 성공적으로 삭제되었습니다.');
  } catch (error) {
    console.error('설문 삭제 실패:', error.message);
    alert('설문 삭제에 실패했습니다.');
  }
};

// 설문 상세 보기
const viewDetails = (surveyId) => {
  window.location.href = `/survey/recommendations/${surveyId}`;
};

onMounted(() => {
  fetchSurveys();
});
</script>
