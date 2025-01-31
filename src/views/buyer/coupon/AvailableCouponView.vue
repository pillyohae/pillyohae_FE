<template>
  <v-app>
    <!-- 
      공통 네비게이션 바 컴포넌트
      - 구매자 페이지 상단에 고정된 네비게이션 바
    -->
    <buyer-navigation-bar />

    <v-main>
      <!-- 
        사용 가능한 쿠폰 목록을 표시하는 컴포넌트
        - :availableCoupons="availableCoupons": 서버에서 가져온 쿠폰 데이터를 props로 전달
      -->
      <available-coupon-form :availableCoupons="availableCoupons" />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Vue Composition API
import api from '../../../api/axios'; // 서버와 통신을 위한 Axios 모듈
import AvailableCouponForm from '../../../components/buyer/coupon/AvailableCouponForm.vue'; // 쿠폰 목록을 렌더링하는 컴포넌트
import BuyerNavigationBar from '../../buyer/BuyerNavigationBar.vue'; // 구매자 네비게이션 바 컴포넌트

// 발급 가능한 쿠폰 목록을 저장하는 반응형 상태
const availableCoupons = ref([]);

// 발급 가능한 쿠폰 조회 함수
const fetchAvailableCoupons = async () => {
  try {
    // 서버로 GET 요청을 보내서 사용 가능한 쿠폰 목록을 가져옴
    const response = await api.get('/coupons/available');

    // 응답 데이터에서 쿠폰 목록을 상태 변수에 저장
    availableCoupons.value = response.data.couponList;
  } catch (error) {
    // 에러 발생 시 콘솔에 출력 및 사용자에게 알림 표시
    console.error('발급 가능한 쿠폰 조회 실패:', error.response?.data || error.message);
  }
};

// 컴포넌트가 마운트되면 실행되는 로직
// - 화면이 로드될 때 자동으로 쿠폰 목록을 가져옴
onMounted(() => {
  fetchAvailableCoupons();
});
</script>
