<template>
    <!-- 내비게이션 바 -->
    <v-app-bar app>
        <v-toolbar-title>Pill요해?</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text to="/seller" color="green">홈</v-btn>
        <v-btn text color="green" @click=performLogin>로그인/회원가입</v-btn>
      </v-app-bar>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();
  
  const performLogin = async () => {
        router.push('/login');
  };
  </script>
  
  <style>
  
  </style>