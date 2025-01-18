<template>
  <v-app>
    <!-- 내비게이션 바 -->
    <v-app-bar app>
      <v-toolbar-title>Pill요해?</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/buyer">홈</v-btn>
      <v-btn text to="#">설문</v-btn>
      <v-btn text to="/cart">장바구니</v-btn>
      <v-btn text to="#">마이페이지</v-btn>
      <v-btn text color="red" @click="performLogout ">로그아웃</v-btn>
    </v-app-bar>

    <!-- 장바구니 폼 -->
    <v-main>
      <CartForm :products="cart.products" :totalPrice="cart.totalPrice" @proceedToOrder="navigateToPayReady"
        @refresh="fetchCart" />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import router from "../../router";
import api from '../../api/axios';
import CartForm from '../../components/buyer/CartForm.vue';
import { logout } from '../../utils/auth';

// 장바구니 데이터 (반응형 상태)
const cart = reactive({
  products: [], // 장바구니 상품 목록
  totalPrice: 0, // 총 금액
});

// 장바구니 데이터를 서버에서 가져오는 함수
const fetchCart = async () => {
  try {
    const response = await api.get('/carts');
    console.log('API 응답:', response.data);
    cart.products = response.data.products; // 상품 목록 설정
    cart.totalPrice = response.data.totalPrice; // 총 금액 설정
  } catch (error) {
    console.error('장바구니 불러오기 실패:', error.response?.data || error.message);
  }
};

// 로그아웃 처리 함수
const performLogout  = async () => {
  await logout();
};

// 선택된 상품 데이터를 결제 페이지로 전달
const navigateToPayReady = ({ selectedProducts, totalPrice }) => {
  router.push({
    name: 'BuyerPayReadyView',
    query: {
      products: JSON.stringify(selectedProducts), // 상품 목록을 문자열로 변환
      totalPrice: totalPrice, // 총 금액
    },
  });
};

// 컴포넌트가 마운트되면 장바구니 데이터 가져오기
onMounted(() => {
  fetchCart();
});
</script>

