<template>
  <v-container>
    <!-- 페이지 상단 제목 -->
    <v-row justify="center">
      <!-- 추천 결과 페이지 제목 -->
      <v-card-title class="text-h5 font-weight-bold">영양성분 추천 결과</v-card-title>
    </v-row>

    <!-- 설문 목록 -->
    <v-row>
      <!-- surveys 배열을 반복해서 설문 결과를 카드 형태로 렌더링 -->
      <!-- cols="12": 모바일 화면에서 전체 너비로 설정 -->
      <!-- md="6": 중간 화면 이상에서 카드 2개씩 배치 -->
      <v-col v-for="survey in surveys" :key="survey.surveyId" cols="12" md="3">
        <v-card outlined class="mb-4 position-relative">
          <!-- 삭제 버튼 -->
          <!-- @click: deleteSurvey 이벤트를 부모 컴포넌트로 전달 -->
          <v-btn
            icon
            class="delete-button"
            text
            @click="$emit('deleteSurvey', survey.surveyId)"
          >
            x
          </v-btn>

          <!-- 설문 결과 제목 -->
          <v-card-title>설문 결과</v-card-title>

          <!-- 설문 데이터 -->
          <v-card-text>
            <!-- 설문 분석 날짜 -->
            <p>분석 날짜: {{ formatDate(survey.createAt) }}</p>
            <!-- 상태 표시 -->
            <v-chip class="mt-4" color="green" text-color="white" small>분석완료</v-chip>
          </v-card-text>

          <!-- 설문 상세 보기 버튼 -->
          <!-- @click: viewDetails 이벤트를 부모 컴포넌트로 전달 -->
          <v-card-actions>
            <v-btn text color="primary" @click="$emit('viewDetails', survey.surveyId)">
              추천 결과 상세 >
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 설문이 없을 때 메시지 표시 -->
    <div v-if="surveys.length === 0" class="text-center my-5">
      <p>아직 설문을 작성하지 않았습니다!</p>
    </div>

    <!-- 설문 생성 버튼 -->
    <!-- to="/survey/create": 설문 작성 페이지로 이동 -->
    <v-row justify="center" class="my-5">
      <v-btn color="green" large to="/survey/create">
        영양제 추천 설문 작성하기!
      </v-btn>
    </v-row>
  </v-container>
</template>

<script setup>
import { defineProps } from 'vue'; // Vue Composition API를 사용하여 props 정의

// 부모 컴포넌트에서 전달받는 props 정의
const props = defineProps({
  surveys: {
    type: Array, // 설문 데이터 배열
    required: true, // 필수 값
  },
});

// 날짜를 포맷팅하는 유틸리티 함수
// - dateString: ISO 8601 형식의 날짜 문자열
// - 반환값: 'YYYY-MM-DD' 형식의 날짜 문자열
const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    // 날짜 변환 실패 시 기본 메시지 반환
    return '날짜 정보 없음';
  }
};
</script>

<style scoped>
/* 삭제 버튼 스타일 */
.delete-button {
  position: absolute; /* 카드 상단 우측에 고정 */
  top: 8px;
  right: 8px;
  color: red; /* 빨간색 텍스트 */
  font-weight: bold; /* 텍스트 굵게 */
  font-size: 1.2em; /* 텍스트 크기 */
  cursor: pointer; /* 클릭 가능한 커서 스타일 */
  transition: transform 0.2s; /* 호버 시 애니메이션 추가 */
}

</style>
