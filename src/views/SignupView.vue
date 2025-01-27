<template>
  <div>
    <!-- 뒤로가기 버튼 -->
    <v-btn icon class="back-button" @click="goToLogin">
      <!-- 아이콘: 뒤로가기 화살표 -->
      <v-icon>mdi-arrow-left</v-icon>
    </v-btn>

    <!-- SignupForm 컴포넌트 -->
    <!-- 회원가입 폼 컴포넌트를 사용하며 handleSignup 이벤트를 전달 -->
    <SignupForm @handleSignup="SignupUser" />
  </div>
</template>

<script setup>
import SignupForm from "../components/SignupForm.vue"; // 회원가입 폼 컴포넌트 가져오기
import api from "../api/axios"; // Axios를 통한 API 요청을 위한 모듈 가져오기
import { useRouter } from "vue-router"; // Vue Router 사용을 위한 함수 가져오기

const router = useRouter(); // Vue Router 인스턴스 생성

// 뒤로가기 버튼 클릭 시 실행되는 함수
const goToLogin = () => {
  // /login 경로로 이동 (로그인 페이지로 이동)
  router.push("/login");
};

// 회원가입 처리 함수
const SignupUser = async (userInfo) => {
  try {
    // 서버로 회원가입 정보(userInfo)를 POST 요청
    const response = await api.post("/users/signup", userInfo);
    console.log("회원가입 성공 : ", response.data); // 성공 시 응답 데이터 콘솔 출력
    alert("회원가입 성공"); // 성공 알림 메시지
    router.push("/login"); // 회원가입 완료 후 로그인 페이지로 이동
  } catch (error) {
    // 회원가입 실패 시 에러 처리
    console.error("회원가입 실패 : ", error.response?.data || error.message); // 에러 로그 출력
    alert("회원가입 실패 다시 시도해주세요"); // 실패 알림 메시지
  }
};
</script>


<style scoped>
/* 뒤로가기 버튼 스타일 */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #4caf50;
  background: none;
  border: none;
}
</style>