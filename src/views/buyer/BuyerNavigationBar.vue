<template>
  <v-app-bar app>
    <v-toolbar-title>Pill요해?</v-toolbar-title>
    <v-spacer></v-spacer>
    <!-- 네비게이션 메뉴 -->
    <v-btn text to="/buyer" color="green">홈</v-btn>
    <v-btn text to="/survey" color="green">설문</v-btn>
    <v-btn text to="/cart" color="green">장바구니</v-btn>
    <v-btn text to="/coupon" color="green">쿠폰 확인</v-btn>
    <v-btn text to="/mypage" color="green">마이페이지</v-btn>
    <!-- 로그아웃 버튼 -->
    <v-btn text color="red" @click="performLogout">로그아웃</v-btn>
  </v-app-bar>
</template>

<script setup>
import { logout } from '../../utils/auth'; // 로그아웃 유틸 함수

const performLogout = async () => {
  await logout();
};
</script>

<style scoped>
/* 추가 스타일이 있다면 여기에 작성 */
</style>
