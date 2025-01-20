<template>
  <v-app>
    <!-- 내비게이션 바 -->
    <v-app-bar app>
      <v-toolbar-title>Pill요해?</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- 네비게이션 메뉴 -->
      <v-btn text to="/buyer">홈</v-btn>
      <v-btn text to="#">설문</v-btn>
      <v-btn text to="/cart">장바구니</v-btn>
      <v-btn text to="/mypage">마이페이지</v-btn>
      <!-- 로그아웃 버튼 -->
      <v-btn text color="red" @click="performLogout ">로그아웃</v-btn>
    </v-app-bar>

    <!-- 상품 목록 -->
    <v-main>
      <!-- BuyerProductFormView 컴포넌트를 사용하여 상품 표시 
         Vue의 props를 통해 부모에서 자식으로 데이터를 전달하는 방식
         :products는 부모의 products 데이터를 자식 컴포넌트 ProductForm의 props로 전달-->
      <ProductForm :products="products" />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // 반응형 상태와 라이프사이클 훅
import ProductForm from '../../components/buyer/BuyerProductForm.vue'; // 상품 표시 컴포넌트
import api from '../../api/axios'; // 서버와 통신을 위한 Axios
import { logout } from '../../utils/auth'; // 로그아웃 유틸 함수

// 상품 데이터를 관리하는 반응형 상태
const products = ref([]); // 서버에서 받아온 상품 목록

// 서버에서 상품 목록을 가져오는 함수
const fetchProducts = async () => {
  try {
    const response = await api.get('/products/search'); // 서버로 GET 요청
    products.value = response.data.content.filter((product) => product.status === 'SELLING');
  } catch (error) {
    console.error('제품 목록을 가져오는 중 오류 발생:', error.response?.data || error.message);
    alert('제품 목록을 불러오지 못했습니다.');
  }
};

// 로그아웃 처리 함수
const performLogout  = async () => {
  await logout();
};

// 컴포넌트가 마운트된 후 서버에서 상품 데이터를 가져옴
onMounted(() => {
  fetchProducts();
});
</script>