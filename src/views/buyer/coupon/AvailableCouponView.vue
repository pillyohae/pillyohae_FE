<template>
    <v-app>
      <!-- 공통 네비게이션 바 -->
      <buyer-navigation-bar />
  
      <v-main>
        <available-coupon-form :availableCoupons="availableCoupons" />
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import api from '../../../api/axios';
  import AvailableCouponForm from '../../../components/buyer/coupon/AvailableCouponForm.vue';
  import BuyerNavigationBar from '../../buyer/BuyerNavigationBar.vue';
  
  const availableCoupons = ref([]);
  
  // 발급 가능한 쿠폰 조회
  const fetchAvailableCoupons = async () => {
    try {
      const response = await api.get('/coupons');
      availableCoupons.value = response.data.couponList;
    } catch (error) {
      console.error('발급 가능한 쿠폰 조회 실패:', error.response?.data || error.message);
    }
  };
  
  onMounted(() => {
    fetchAvailableCoupons();
  });
  </script>
  