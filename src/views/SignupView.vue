<template>
    <div>
      <!-- 뒤로가기 버튼 -->
      <v-btn icon class="back-button" @click="goToLogin">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
  
      <!-- SignupForm 컴포넌트 -->
      <SignupForm @handleSignup="SignupUser" />
    </div>
  </template>
  
  <script setup>
  import SignupForm from "../components/SignupForm.vue";
  import api from "../api/axios";
  import { useRouter } from "vue-router";
  
  const router = useRouter();

  const goToLogin = () => {
    router.push("/login"); // /login 경로로 이동
  };
  
  const SignupUser = async (userInfo) => {
    try {
      const response = await api.post("/users/signup", userInfo);
      console.log("회원가입 성공 : ", response.data);
      alert("회원가입 성공");
      router.push("/login");
    } catch (error) {
      console.error("회원가입 실패 : ", error.response?.data || error.message);
      alert("회원가입 실패 다시 시도해주세요");
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
  