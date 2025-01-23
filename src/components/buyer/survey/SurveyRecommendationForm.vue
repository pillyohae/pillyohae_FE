<template>
    <v-container>
      <h1 class="text-h5 font-weight-bold mb-6">영양성분 추천 결과</h1>
  
      <v-row>
        <v-col v-for="product in recommendations" :key="product.productId" cols="12" md="6" lg="4">
          <v-card outlined class="mb-4">
            <v-img
              :src="product.imageUrl || 'https://via.placeholder.com/200'"
              alt="상품 이미지"
              height="200"
            ></v-img>
            <v-card-title class="font-weight-bold">{{ product.productName }}</v-card-title>
            <v-card-subtitle class="grey--text text--darken-1">{{ formatPrice(product.price) }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 장바구니 담기 버튼 -->
      <v-btn color="green" block large class="mt-6" @click="addAllToCart">추천 영양제 장바구니 담기</v-btn>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from "vue";
  import api from "../../../api/axios";
  
  const props = defineProps({
    recommendations: {
      type: Array,
      required: true,
    },
  });
  
  // 가격 포맷팅 함수
  const formatPrice = (price) => {
    return `${price.toLocaleString()}원`;
  };
  
  // 장바구니 추가 함수
  const addAllToCart = async () => {
    try {
      for (const product of props.recommendations) {
        await api.post("/cart", { productId: product.productId, quantity: 1 });
      }
      alert("추천 상품이 장바구니에 추가되었습니다.");
    } catch (error) {
      console.error("장바구니 추가 실패:", error.response?.data || error.message);
      alert("장바구니 추가에 실패했습니다.");
    }
  };
  </script>
  
  <style scoped>
  /* 카드 호버 효과 */
  .v-card {
    transition: box-shadow 0.3s ease;
  }
  
  .v-card:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
  </style>
  