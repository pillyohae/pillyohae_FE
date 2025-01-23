<template>
    <v-app>
      <!-- 내비게이션 바 -->
      <v-app-bar app>
        <v-toolbar-title>Pill요해?</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text to="/seller">홈</v-btn>
        <v-btn text to="/seller/product" color="green">내 상품 보기</v-btn>
        <v-btn text to="#">요청 주문 내역</v-btn>
        <v-btn text to="#">마이페이지</v-btn>
        <v-btn text color="red" @click="performLogout">로그아웃</v-btn>
      </v-app-bar>
  
      <!-- 상품 상세 Form -->
      <v-main>
        <div v-if="product">
          <product-detail-form :product="product" />
        </div>
        <div v-else class="text-center my-5">
          <v-progress-circular indeterminate color="green"></v-progress-circular>
          <p>상품 정보를 불러오는 중...</p>
        </div>
      </v-main>
    </v-app>

    <v-row justify="center" class="fixed-bottom">
        <v-btn color="green" large @click="goToEdit">수정하기</v-btn>
      </v-row>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import ProductDetailForm from '../../../components/seller/product/ProductDetailForm.vue';
  import api from '../../../api/axios';
  import { useRoute } from 'vue-router';
  import { logout } from '../../../utils/auth';
  
  const product = ref(null);
  
  const router = useRoute();
  
  const performLogout = async () => {
    await logout(router);
  };
  
  const fetchProductDetails = async () => {
    const productId = router.params.productId;
    try {
      const response = await api.get(`/products/${productId}`);
      product.value = response.data;
    } catch (error) {
      console.error('상품 상세 조회 실패:', error);
      alert('상품 정보를 불러오지 못했습니다.');
      router.push('/seller/product');
    }
  };
  
  onMounted(fetchProductDetails);
  </script>
  
  <style scoped>
    
  /* 수정 버튼 */
  .fixed-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px;
    background-color: black;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .fixed-bottom v-btn {
    width: 100%;
  }
</style>