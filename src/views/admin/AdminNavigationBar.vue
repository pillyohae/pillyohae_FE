<template>
    <!-- 내비게이션 바 -->
    <v-app-bar app>
        <v-toolbar-title>Pill요해?</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text to="/admin">홈</v-btn>
        <v-btn text to="/admin/coupon" color="green">쿠폰</v-btn>
        <v-btn text color="red" @click="performLogout">로그아웃</v-btn>
      </v-app-bar>
  </template>
  
  <script setup>
  import { logout } from '../../utils/auth';
  // 로그아웃 처리
  const performLogout = async () => {
          await logout();
  };
  </script>
  
  <style>
  
  </style>