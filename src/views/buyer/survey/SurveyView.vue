<template>
  <v-app>
    <!-- 
      공통 네비게이션 바 컴포넌트 
      - 구매자 페이지 상단에 고정된 네비게이션 바
    -->
    <buyer-navigation-bar />

    <!-- 메인 컨텐츠 -->
    <v-main>
      <!-- 
        설문 Form 컴포넌트
        - :surveys: 서버에서 가져온 설문 데이터 리스트를 props로 전달
        - @viewDetails: 설문 상세 보기 이벤트 처리
        - @deleteSurvey: 설문 삭제 이벤트 처리
      -->
      <survey-form
        :surveys="surveys"
        @viewDetails="viewDetails"
        @deleteSurvey="deleteSurvey"
      />
    </v-main>
  </v-app>
</template>

<script setup>
import BuyerNavigationBar from '../BuyerNavigationBar.vue'; // 구매자 네비게이션 바 컴포넌트
import SurveyForm from '../../../components/buyer/survey/SurveyForm.vue'; // 설문 폼 컴포넌트
import { ref, onMounted } from 'vue'; // Vue Composition API
import api from '../../../api/axios'; // 서버와 통신하기 위한 Axios 모듈

// 설문 데이터 리스트 (반응형 상태)
const surveys = ref([]); // 서버에서 가져온 설문 목록을 저장

// 설문 목록을 서버에서 조회하는 함수
const fetchSurveys = async () => {
  try {
    // GET 요청으로 설문 데이터를 가져옴
    const response = await api.get('/surveys');
    surveys.value = response.data; // 설문 데이터를 surveys 상태에 저장
  } catch (error) {
    // 에러 발생 시 콘솔에 출력
    console.error('설문 목록 조회 실패:', error.message);
  }
};

// 설문 삭제 함수
// - 특정 설문 ID를 서버에 요청하여 삭제
const deleteSurvey = async (surveyId) => {
  try {
    // DELETE 요청으로 설문 삭제
    await api.delete(`/surveys/${surveyId}`);
    
    // 삭제된 설문을 리스트에서 제거
    surveys.value = surveys.value.filter((survey) => survey.surveyId !== surveyId);

    // 성공 메시지 출력
    alert('설문이 성공적으로 삭제되었습니다.');
  } catch (error) {
    // 에러 발생 시 콘솔에 출력 및 알림 표시
    console.error('설문 삭제 실패:', error.message);
    alert('설문 삭제에 실패했습니다.');
  }
};

// 설문 상세 보기 함수
// - 특정 설문의 ID를 통해 상세 페이지로 이동
const viewDetails = (surveyId) => {
  // 브라우저의 현재 URL을 설문 상세 페이지로 변경
  window.location.href = `/survey/recommendations/${surveyId}`;
};

// 컴포넌트가 화면에 렌더링되면 설문 데이터를 서버에서 조회
onMounted(() => {
  fetchSurveys(); // 설문 목록 가져오기 함수 호출
});
</script>
