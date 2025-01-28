<template>
  <v-container>
    <!-- 페이지 제목 -->
    <h1 class="text-h5 font-weight-bold mb-6">영양성분 추천 결과</h1>

    <!-- 추천 영양성분 목록 -->
    <v-row>
      <!-- v-for: 추천 상품 배열(recommendations)을 반복해서 렌더링 -->
      <!-- cols="12": 모바일 화면에서 전체 너비로 설정 -->
      <!-- md="6": 중간 화면에서 카드 2개씩 배치 -->
      <!-- lg="4": 큰 화면에서 카드 3개씩 배치 -->
      <v-col v-for="product in recommendations" :key="product.productId" cols="12" md="6" lg="4">
        <v-card outlined class="mb-4">
          <!-- 상품 이미지 -->
          <!-- :src: 상품 이미지 URL 또는 기본 이미지 (이미지가 없을 경우 대체) -->
          <v-img
            :src="product.imageUrl || 'https://via.placeholder.com/200'"
            alt="상품 이미지"
            height="200"
          ></v-img>

          <!-- 상품 이름 -->
          <v-card-title class="font-weight-bold">{{ product.productName }}</v-card-title>

          <!-- 상품 가격 -->
          <!-- formatPrice: 가격 데이터를 '1,000원' 형식으로 변환 -->
          <v-card-subtitle class="grey--text text--darken-1">{{ formatPrice(product.price) }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- 장바구니 담기 버튼 -->
    <!-- block: 버튼을 부모 요소의 전체 너비로 설정 -->
    <!-- large: 버튼 크기를 크게 설정 -->
    <!-- @click: addAllToCart 함수 호출 -->
    <v-btn color="green" block large class="mt-6" @click="addAllToCart">
      추천 영양제 장바구니 담기
    </v-btn>
  </v-container>
</template>

<script setup>
import api from "../../../api/axios"; // 서버와 통신하기 위한 Axios 모듈

// 부모 컴포넌트에서 전달받는 props 정의
const props = defineProps({
  // 추천 상품 배열
  recommendations: {
    type: Array, // 배열 타입
    required: true, // 필수 값
  },
});

// 가격 포맷팅 함수
// - 가격 데이터를 '1,000원' 형식으로 변환
const formatPrice = (price) => {
  return `${price.toLocaleString()}원`;
};

// 장바구니 추가 함수
// - 추천 상품 배열(recommendations)에 포함된 모든 상품을 장바구니에 추가
const addAllToCart = async () => {
  try {
    // 추천 상품 배열 반복
    for (const product of props.recommendations) {
      // API 요청: 각 상품을 장바구니에 추가
      await api.post("/carts", { productId: product.productId, quantity: 1 });
    }
    // 성공 메시지 출력
    alert("추천 상품이 장바구니에 추가되었습니다.");
  } catch (error) {
    // 에러 발생 시 콘솔에 출력 및 실패 메시지 표시
    console.error("장바구니 추가 실패:", error.response?.data || error.message);
    alert("장바구니 추가에 실패했습니다.");
  }
};
</script>

<style scoped>
/* 카드 호버 효과 */
.v-card {
  transition: box-shadow 0.3s ease; /* 카드에 호버 시 부드러운 그림자 효과 추가 */
}

.v-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* 호버 시 그림자 강조 */
}
</style>
