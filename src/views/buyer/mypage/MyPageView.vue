<template>
    <v-app>
      <!-- 
        공통 네비게이션 바 컴포넌트
        - 구매자 페이지 상단에 고정된 네비게이션 바
      -->
      <buyer-navigation-bar />
  
      <v-main>
        <!-- 
          마이페이지 폼 컴포넌트
          - :userInfo="userInfo": 사용자 정보를 props로 전달
          - :coupons="coupons": 사용 가능한 쿠폰 목록을 props로 전달
        -->
        <my-page-form :userInfo="userInfo" :coupons="coupons" />
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import { onMounted, reactive, ref } from 'vue'; // Vue Composition API
  import MyPageForm from '../../../components/buyer/mypage/MyPageForm.vue'; // 마이페이지 폼 컴포넌트
  import BuyerNavigationBar from '../BuyerNavigationBar.vue'; // 구매자 네비게이션 바 컴포넌트
  import api from '../../../api/axios'; // 서버와 통신을 위한 Axios 모듈
  
  // 사용자 정보 저장 (반응형 객체)
  const userInfo = reactive({
    name: '', // 사용자 이름
    email: '', // 사용자 이메일
  });
  
  // 사용자의 쿠폰 목록 (반응형 상태)
  const coupons = ref([]);
  
  // 마이페이지 데이터를 가져오는 함수
  onMounted(async () => {
    try {
      // 사용자 프로필 정보 가져오기
      const userResponse = await api.get('/users/profile');
      userInfo.name = userResponse.data.name; // 사용자 이름 설정
      userInfo.email = userResponse.data.email; // 사용자 이메일 설정
  
      // 사용자가 보유한 쿠폰 목록 가져오기
      const couponResponse = await api.get('/users/coupons');
      coupons.value.push(...couponResponse.data.couponList); // 쿠폰 목록 업데이트
    } catch (error) {
      // 에러 발생 시 콘솔에 출력 및 사용자에게 알림 표시
      console.log('사용자 정보 조회 실패 : ', error.response?.data || error.response.message);
    }
  });
  </script>
  