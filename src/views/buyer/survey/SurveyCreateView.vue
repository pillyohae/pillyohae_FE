<!--SurveyCreateView.vue-->
<template>
    <v-container>
      <!-- 상단 네비게이션 -->
      <v-row align-center justify="space-between" class="mb-4">
        <v-btn icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card-title>설문 작성</v-card-title>
      </v-row>
  
      <!-- 설문 생성 Form -->
      <survey-create-form @submitSurvey="submitSurvey" />
    </v-container>
  </template>
  
  <script setup>
  import SurveyCreateForm from '../../../components/buyer/survey/SurveyCreateForm.vue';
  import api from '../../../api/axios';
  
  const submitSurvey = async (categories) => {
    try {
      await api.post('/surveys', { categories });
      alert('설문이 성공적으로 저장되었습니다!');
      window.location.href = '/survey'; // 설문 목록 화면으로 이동
    } catch (error) {
      console.error('설문 저장 실패:', error.response?.data || error.message);
      alert('설문 저장에 실패했습니다.');
    }
  };
  </script>
  