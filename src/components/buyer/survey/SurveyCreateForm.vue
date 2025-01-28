<template>
  <v-container>
    <!-- 페이지 제목 -->
    <v-row justify="center" class="mb-4">
      <v-card-title class="text-h5 font-weight-bold">
        개선하고 싶은 부분을 순서대로 골라주세요
      </v-card-title>
    </v-row>

    <!-- 카테고리 선택 버튼 -->
    <v-row justify="center" class="mb-4">
      <!-- 
        v-for: categories 배열을 반복하여 버튼 생성
        cols="6": 모바일 화면에서 버튼 2개씩 배치
        md="3": 중간 화면에서 버튼 4개씩 배치
      -->
      <v-col
        v-for="category in categories"
        :key="category"
        cols="6"
        md="3"
        class="d-flex justify-center"
      >
        <!-- 
          카테고리 버튼
          :color: 선택된 카테고리는 'green', 선택되지 않은 카테고리는 'grey lighten-2'
          @click: 카테고리를 선택/해제하는 toggleCategory 함수 호출
        -->
        <v-btn
          :color="selectedCategories.includes(category) ? 'green' : 'grey lighten-2'"
          block
          @click="toggleCategory(category)"
        >
          <!-- 선택 순위를 표시 -->
          <span v-if="selectedCategories.includes(category)">
            {{ selectedCategories.indexOf(category) + 1 }}위
          </span>
          <!-- 카테고리 이름 -->
          {{ category }}
        </v-btn>
      </v-col>
    </v-row>

    <!-- 선택 상태 표시 -->
    <!-- 선택된 카테고리 개수를 표시 -->
    <v-row justify="center" class="mb-4">
      <p>{{ selectedCategories.length }}/3개 선택 완료</p>
    </v-row>

    <!-- 설문 저장 버튼 -->
    <v-row justify="center">
      <!-- 
        @click: 설문 저장 함수(submitSurvey) 호출
        :disabled: 선택된 카테고리가 3개가 아니면 버튼 비활성화
      -->
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
import { ref } from 'vue'; // 반응형 상태 관리
import { useRouter } from 'vue-router'; // 페이지 이동을 위한 Vue Router
import api from '../../../api/axios'; // 서버와 통신하기 위한 Axios 모듈

// Vue Router 인스턴스 생성
const router = useRouter();

// 카테고리 목록 (설문 항목)
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

// 선택된 카테고리를 저장하는 반응형 배열
const selectedCategories = ref([]);

// 카테고리 선택/해제 함수
const toggleCategory = (category) => {
  // 선택된 카테고리 배열에서 해당 카테고리의 인덱스를 확인
  const index = selectedCategories.value.indexOf(category);

  if (index > -1) {
    // 이미 선택된 경우: 배열에서 제거
    selectedCategories.value.splice(index, 1);
  } else if (selectedCategories.value.length < 3) {
    // 선택되지 않은 경우: 배열에 추가 (최대 3개까지 선택 가능)
    selectedCategories.value.push(category);
  }
};

// 설문 저장 함수
const submitSurvey = async () => {
  try {
    // 서버로 설문 데이터 전송 (POST 요청)
    const response = await api.post('/surveys', {
      categories: selectedCategories.value.join(', '), // 선택된 카테고리를 문자열로 변환
    });

    // 설문 ID를 사용해 추천 상품 생성 요청
    await api.post(`/surveys/${response.data.surveyId}/recommendations`);

    // 성공 메시지 출력
    alert('설문과 추천 상품 생성이 완료되었습니다!');

    // 설문 결과 페이지로 이동
    router.push('/survey');
  } catch (error) {
    // 에러 발생 시 메시지 출력
    console.error('설문 저장 실패:', error.message);
    alert('설문 저장에 실패했습니다.');
  }
};
</script>
