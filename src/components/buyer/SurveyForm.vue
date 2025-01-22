<template>
    <v-container>
      <v-row justify="center">
        <v-card-title class="text-h5 font-weight-bold">영양성분 추천 결과</v-card-title>
      </v-row>
  
      <!-- 설문 목록 -->
      <v-row>
        <v-col v-for="survey in surveys" :key="survey.surveyId" cols="12" md="6">
          <v-card outlined class="mb-4">
            <v-card-title>설문 결과</v-card-title>
            <v-card-text>
              <p>분석 날짜: {{ formatDate(survey.createdAt) }}</p>
              <p>선택한 카테고리: {{ survey.categories }}</p>
              <v-chip color="green" text-color="white" small>분석완료</v-chip>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="primary" @click="$emit('viewDetails', survey.surveyId)">
                추천 결과 상세 >
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 설문이 없을 때 -->
      <div v-if="surveys.length === 0" class="text-center my-5">
        <p>아직 설문을 작성하지 않았습니다!</p>
      </div>
  
      <!-- 설문 생성 버튼 -->
      <v-row justify="center" class="my-5">
        <v-btn color="green" large to="/survey/create">
          영양제 추천 설문 작성하기!
        </v-btn>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  const props = defineProps({
    surveys: {
      type: Array,
      required: true,
    },
  });
  
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return '날짜 정보 없음';
    }
  };
  </script>
  