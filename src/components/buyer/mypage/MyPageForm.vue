<template>
    <v-container>
      <!-- 마이페이지 카드 -->
      <v-card class="my-4">
        <v-card-title>마이페이지</v-card-title>
        <v-card-text>
          <p>이름: {{ userInfo.name }}</p> <!-- 사용자 이름 표시 -->
          <p>이메일: {{ userInfo.email }}</p> <!-- 사용자 이메일 표시 -->
          <v-btn color="green" to="/myprofile">프로필 보기</v-btn> <!-- 프로필 페이지 이동 버튼 -->
        </v-card-text>
      </v-card>
  
      <v-row>
        <!-- 주문 내역 카드 -->
        <v-col cols="4">
          <v-card outlined class="text-center">
            <v-card-title>주문내역</v-card-title>
            <v-card-text>
              <v-icon color="primary" large>mdi-package</v-icon> <!-- 아이콘 -->
            </v-card-text>
            <v-btn color="primary" to="/myorder">주문 내역</v-btn> <!-- 주문 내역 페이지 이동 버튼 -->
          </v-card>
        </v-col>
  
        <!-- 쿠폰 카드 -->
        <v-col cols="4">
          <v-card outlined class="text-center">
            <v-card-title>쿠폰</v-card-title>
            <v-card-text>
              <v-icon color="success" large>mdi-ticket-percent</v-icon> <!-- 아이콘 -->
            </v-card-text>
            <v-btn color="success" @click="showCouponDialog = true">쿠폰 확인</v-btn> <!-- 쿠폰 목록 표시 버튼 -->
          </v-card>
        </v-col>
  
        <!-- 영양제 추천 결과 카드 -->
        <v-col cols="4">
          <v-card outlined class="text-center">
            <v-card-title>영양제 추천 결과</v-card-title>
            <v-card-text>
              <v-icon color="info" large>mdi-pill</v-icon> <!-- 아이콘 -->
            </v-card-text>
            <v-btn color="info" to="/survey">추천 결과 보기</v-btn> <!-- 설문 결과 페이지 이동 버튼 -->
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 쿠폰 목록 다이얼로그 -->
      <v-dialog v-model="showCouponDialog" max-width="600px">
        <v-card>
          <v-card-title>내 쿠폰 목록</v-card-title>
          <v-card-text>
            <!-- 사용 가능한 쿠폰이 있는 경우 -->
            <v-col v-if="coupons.length > 0">
              <!-- v-for를 사용하여 쿠폰 목록을 반복 렌더링 -->
              <v-card v-for="coupon in coupons" :key="coupon.couponId" class="mb-4" outlined>
                <v-card-title>{{ coupon.couponName }}</v-card-title> <!-- 쿠폰 이름 -->
                <v-card-subtitle class="grey--text text--darken-1">
                  {{ coupon.couponDescription }} <!-- 쿠폰 설명 -->
                </v-card-subtitle>
                <v-card-text>
                  <!-- 퍼센트 할인 쿠폰인 경우 -->
                  <p v-if="coupon.discountType === 'PERCENTAGE'">
                    할인: {{ coupon.fixedRate }}% (최대 {{ coupon.maxDiscountAmount }}원)
                  </p>
                  <!-- 정액 할인 쿠폰인 경우 -->
                  <p v-else-if="coupon.discountType === 'FIXED_AMOUNT'">
                    할인: {{ coupon.fixedAmount }}원
                  </p>
                </v-card-text>
              </v-card>
            </v-col>
            <!-- 사용 가능한 쿠폰이 없는 경우 -->
            <p v-else>사용 가능한 쿠폰이 없습니다.</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" text @click="showCouponDialog = false">닫기</v-btn> <!-- 다이얼로그 닫기 버튼 -->
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import { defineProps, ref } from 'vue'; // Vue Composition API에서 props와 ref 사용
  
  // 부모 컴포넌트에서 전달받는 props 정의
  const props = defineProps({
    userInfo: {
      type: Object, // 사용자 정보 객체
      required: true, // 필수 값
    },
  
    coupons: {
      type: Array, // 쿠폰 목록 배열
      default: () => [], // 기본값 빈 배열
    },
  });
  
  // 쿠폰 다이얼로그 표시 여부 상태
  const showCouponDialog = ref(false);
  </script>
  
  <style scoped>
  /* 텍스트 중앙 정렬 */
  .text-center {
    text-align: center;
  }
  
  /* 카드 스타일 */
  .v-card {
    margin-bottom: 16px; /* 하단 여백 */
    padding: 16px; /* 내부 패딩 */
    border: 1px solid #e0e0e0; /* 테두리 */
    border-radius: 8px; /* 모서리 둥글게 */
  }
  
  /* 카드 제목 스타일 */
  .v-card-title {
    font-weight: bold;
    font-size: 18px;
  }
  
  /* 카드 부제목 스타일 */
  .v-card-subtitle {
    font-size: 14px;
    color: #616161;
  }
  
  /* 카드 본문 스타일 */
  .v-card-text {
    font-size: 14px;
    margin-top: 8px;
  }
  </style>
  