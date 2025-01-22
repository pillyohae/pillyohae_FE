<template>
    <v-app>
      <v-app-bar app>
        <v-toolbar-title>Pill요해?</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- 네비게이션 메뉴 -->
        <v-btn text to="/buyer">홈</v-btn>
        <v-btn text to="/survey">설문</v-btn>
        <v-btn text to="/cart">장바구니</v-btn>
        <v-btn text to="/mypage">마이페이지</v-btn>
        <!-- 로그아웃 버튼 -->
        <v-btn text color="red" @click="performLogout">로그아웃</v-btn>
      </v-app-bar>
  
      <v-main>
        <!-- 설문 Form 컴포넌트 -->
        <survey-form :surveys="surveys" @viewDetails="viewDetails" />
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import SurveyForm from '../../components/buyer/SurveyForm.vue';
  import { ref, onMounted } from 'vue';
  import api from '../../api/axios';
  import { logout } from '../../utils/auth';
  
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
  
  const performLogout = () => {
    logout();
  };
  
  onMounted(() => {
    fetchSurveys();
  });
  </script>
  