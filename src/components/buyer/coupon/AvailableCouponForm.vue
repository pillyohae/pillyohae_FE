<template>
  <v-container>
    <!-- 페이지 제목 -->
    <h1 class="text-h5 font-weight-bold mb-6">사용 가능한 쿠폰</h1>

    <!-- 쿠폰 목록 -->
    <v-row>
      <!-- 
        v-for: availableCoupons 배열을 반복하여 쿠폰 목록을 렌더링
        cols="12": 모바일에서는 한 줄에 1개 표시
        md="6": 태블릿에서는 한 줄에 2개 표시
        lg="4": 데스크탑에서는 한 줄에 3개 표시
        :key="coupon.couponId": 각 쿠폰을 고유 ID를 기준으로 구분
      -->
      <v-col v-for="coupon in availableCoupons" :key="coupon.couponId" cols="12" md="6" lg="4">
        <v-card outlined class="mb-4">
          <!-- 쿠폰 제목 -->
          <v-card-title class="font-weight-bold">{{ coupon.couponName }}</v-card-title>

          <!-- 쿠폰 설명 -->
          <v-card-subtitle class="grey--text text--darken-1">
            {{ coupon.couponDescription }}
          </v-card-subtitle>

          <!-- 쿠폰 상세 정보 -->
          <v-card-text>
            최소 주문 금액: {{ formatPrice(coupon.minimumPrice) }}<br />
            최대 할인 가능 금액: {{ formatPrice(coupon.maxDiscountAmount) }}<br />
            유효기간: {{ calculateExpirationDays(coupon.expiredAt) }}
          </v-card-text>

          <!-- 쿠폰 발급 버튼 -->
          <!-- @click: 해당 쿠폰을 발급하는 issueCoupon 함수 실행 -->
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
import { defineProps } from "vue"; // Vue Composition API에서 props 정의
import api from "../../../api/axios"; // 서버와 통신을 위한 Axios 모듈

// 부모 컴포넌트에서 전달받는 props 정의
const props = defineProps({
  availableCoupons: {
    type: Array, // 쿠폰 목록을 담은 배열
    required: true, // 필수 값
  },
});

// 가격 포맷팅 함수
// - 숫자 값을 "1,000원" 형식으로 변환
const formatPrice = (price) => {
  return `${price.toLocaleString()}원`;
};

// 유효기간 계산 함수
// - 만료일(expiredAt)과 현재 날짜를 비교하여 남은 일수를 계산
const calculateExpirationDays = (expiredAt) => {
  const now = new Date(); // 현재 날짜
  const expirationDate = new Date(expiredAt); // 쿠폰 만료 날짜
  const diffTime = expirationDate - now; // 시간 차이 계산

  if (diffTime < 0) {
    return "만료됨"; // 만료일이 현재보다 과거일 경우 "만료됨" 반환
  }

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // 일 단위로 변환
  return `${diffDays}일 남음`; // 남은 일수 반환
};

// 쿠폰 발급 요청 함수
// - 사용자가 쿠폰을 발급받을 때 실행됨
const issueCoupon = async (couponId) => {
  try {
    // 서버에 쿠폰 발급 요청
    await api.post(`/coupons/${couponId}/issue`);
    alert("쿠폰이 발급되었습니다."); // 성공 메시지 표시
  } catch (error) {
    // 에러 발생 시 콘솔에 출력 및 사용자에게 알림 표시
    console.error("쿠폰 발급 실패:", error.response?.data || error.message);
    alert("쿠폰을 중복해서 발급받을 수 없습니다!");
  }
};
</script>

<style scoped>
/* 카드 스타일 */
/* - 마우스를 올렸을 때 부드러운 그림자 효과 추가 */
.v-card {
  transition: box-shadow 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
