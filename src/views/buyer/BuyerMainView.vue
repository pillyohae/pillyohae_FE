<template>
  <v-app>
    <!-- 공통 네비게이션 바 컴포넌트 -->
    <buyer-navigation-bar />

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
import BuyerNavigationBar from './BuyerNavigationBar.vue';
import { ref, onMounted } from 'vue'; // 반응형 상태와 라이프사이클 훅
import ProductForm from '../../components/buyer/BuyerMainForm.vue'; // 상품 표시 컴포넌트
import api from '../../api/axios'; // 서버와 통신을 위한 Axios

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

// 컴포넌트가 마운트된 후 서버에서 상품 데이터를 가져옴
onMounted(() => {
  fetchProducts();
});
</script>