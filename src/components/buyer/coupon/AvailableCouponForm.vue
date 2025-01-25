<template>
    <v-container>
      <h1 class="text-h5 font-weight-bold mb-6">사용 가능한 쿠폰</h1>
      <v-row>
        <v-col v-for="coupon in availableCoupons" :key="coupon.couponId" cols="12" md="6" lg="4">
          <v-card outlined class="mb-4">
            <v-card-title class="font-weight-bold">{{ coupon.couponName }}</v-card-title>
            <v-card-subtitle class="grey--text text--darken-1">{{ coupon.couponDescription }}</v-card-subtitle>
            <v-card-text>
              최소 주문 금액: {{ formatPrice(coupon.minimumPrice) }}<br />
              최대 할인 가능 금액: {{ formatPrice(coupon.maxDiscountAmount) }}<br />
              유효기간: {{ calculateExpirationDays(coupon.expiredAt) }}
            </v-card-text>
            <v-card-actions>
              <v-btn color="green" block @click="issueCoupon(coupon.couponId)">
                발급받기
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { defineProps } from "vue";
  import api from "../../../api/axios";
  
  const props = defineProps({
    availableCoupons: {
      type: Array,
      required: true,
    },
  });
  
  const formatPrice = (price) => {
    return `${price.toLocaleString()}원`;
  };
  
  const calculateExpirationDays = (expiredAt) => {
    const now = new Date();
    const expirationDate = new Date(expiredAt);
    const diffTime = expirationDate - now;
  
    if (diffTime < 0) {
      return "만료됨";
    }
  
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}일 남음`;
  };
  
  const issueCoupon = async (couponId) => {
    try {
      await api.post(`/coupons/${couponId}/issue`);
      alert("쿠폰이 발급되었습니다.");
    } catch (error) {
      console.error("쿠폰 발급 실패:", error.response?.data || error.message);
      alert("쿠폰을 중복해서 발급받을 수 없습니다!");
    }
  };
  </script>
  
  <style scoped>
  .v-card {
    transition: box-shadow 0.3s ease;
  }
  
  .v-card:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
  </style>
  