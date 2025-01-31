<template>
  <v-app>
    <!-- 판매자 네비게이션 바 -->
    <seller-navigation-bar/>

    <!-- 상품 상세 Form -->
    <v-main>
      <!-- 상품 데이터가 존재하는 경우 상품 상세 정보를 표시 -->
      <div v-if="product">
        <product-detail-form :product="product" />
      </div>
      <!-- 상품 데이터가 없는 경우 로딩 인디케이터 표시 -->
      <div v-else class="text-center my-5">
        <v-progress-circular indeterminate color="green"></v-progress-circular>
        <p>상품 정보를 불러오는 중...</p>
      </div>
    </v-main>
  </v-app>

  <!-- 하단 수정 버튼 (고정 위치) -->
  <v-row justify="center" class="fixed-bottom">
      <v-btn color="green" large @click="goToEdit">수정하기</v-btn>
  </v-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ProductDetailForm from '../../../components/seller/product/ProductDetailForm.vue';
import SellerNavigationBar from '../SellerNavigationBar.vue';
import api from '../../../api/axios';
import { useRoute, useRouter } from 'vue-router';

// 상품 정보를 저장하는 반응형 변수
const product = ref(null);

// Vue Router 사용 (라우트 정보 및 내비게이션)
const router = useRouter();
const route = useRoute();

// 상품 상세 정보를 가져오는 함수
const fetchProductDetails = async () => {
  // URL에서 productId를 가져옴
  const productId = route.params.productId;
  try {
      // API 요청을 통해 상품 상세 정보 가져오기
      const response = await api.get(`/products/${productId}`);
      product.value = response.data; // 상품 데이터 저장
  } catch (error) {
      console.error('상품 상세 조회 실패:', error);
      alert('상품 정보를 불러오지 못했습니다.');
      route.push('/seller/product'); // 실패 시 상품 목록 페이지로 이동
  }
};

// 상품 수정 페이지로 이동하는 함수
const goToEdit = () => {
  // 수정 페이지로 이동하며 현재 상품 정보를 쿼리 파라미터로 전달
  router.push({
      name: 'ProductEditPage',
      params: { productId: product.value.productId },
      query: { productData: JSON.stringify(product.value) }, // 쿼리스트링으로 데이터 전달
  });
};

// 컴포넌트가 마운트될 때 상품 상세 정보 불러오기
onMounted(fetchProductDetails);
</script>

<style scoped>
/* 하단 수정 버튼을 화면 하단에 고정 */
.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

/* 수정 버튼의 너비를 전체로 설정 */
.fixed-bottom v-btn {
  width: 100%;
}
</style>
