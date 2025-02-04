<template>
    <v-container>
      <!-- 결제 실패 제목 -->
      <h2>결제 실패</h2>
  
      <!-- 에러 코드 및 메시지 표시 -->
      <p>에러코드: {{ code }}</p>
      <p>실패 사유: {{ message }}</p>
  
      <!-- 확인 버튼 -->
      <v-btn color="green" @click="handleClose">확인</v-btn>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import router from "../../../router";
  
  // 에러 코드와 메시지
  const code = ref('');
  const message = ref('');
  
  // URL에서 에러 정보를 가져오는 함수
  const fetchErrorInfo = () => {
    const urlParams = new URLSearchParams(window.location.search);
    code.value = urlParams.get('code') || '알 수 없음'; // 에러 코드
    message.value = urlParams.get('message') || '알 수 없는 오류입니다.'; // 실패 사유
  };
  
  // 팝업 창 닫기 함수
  const handleClose = () => {
    if (window.opener) {
      // 부모 창 경로 변경
      window.opener.location.href = '/buyer';
      // 팝업 창이면 닫기
      window.close();
    } else {
      // 팝업 창이 아니면 메인으로 리다이렉트
      router.push('/');
    }
  };
  
  // 컴포넌트가 마운트되면 에러 정보 가져오기
  onMounted(() => {
    fetchErrorInfo();
  });
  </script>
  
  <style scoped>
  /* 스타일 커스터마이징 가능 */
  </style>
  