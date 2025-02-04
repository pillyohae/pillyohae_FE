<template>
  <v-app>
    <!-- 판매자 네비게이션 바 -->
    <seller-navigation-bar />

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

    <!-- 하단 수정 버튼 (고정 위치) -->
    <v-footer app class="footer-container">
      <v-btn color="green" large block @click="goToEdit">수정하기</v-btn>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductDetailForm from '../../../components/seller/product/ProductDetailForm.vue';
import SellerNavigationBar from '../SellerNavigationBar.vue';
import api from '../../../api/axios';
import { useRoute, useRouter } from 'vue-router';

const product = ref(null);
const router = useRouter();
const route = useRoute();

// 상품 상세 정보를 불러오는 함수
const fetchProductDetails = async () => {
  const productId = route.params.productId;
  try {
    const response = await api.get(`/products/${productId}`);
    product.value = response.data;
  } catch (error) {
    console.error('상품 상세 조회 실패:', error);
    alert('상품 정보를 불러오지 못했습니다.');
    router.push('/seller/product');
  }
};

// 수정 페이지로 이동하는 함수
const goToEdit = () => {
  if (!product.value) return;

  const formattedProduct = {
    ...product.value,
    categoryId: product.value.category?.categoryId || null,
    nutrientId: product.value.nutrient?.nutrientId || null,
  };

  router.push({
    name: 'ProductEditPage',
    params: { productId: product.value.productId },
    state: { productData: formattedProduct }, // query가 아닌 state로 데이터 전달
  });
};

onMounted(fetchProductDetails);
</script>

<style scoped>
.footer-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: white;
  padding: 10px 20px;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}
</style>
