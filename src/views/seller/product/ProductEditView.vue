<template>
  <v-container>
    <v-row justify="space-between" class="mb-4">
      <v-btn icon @click="goBack">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h2 class="text-h5 font-weight-bold">상품 수정하기</h2>
      <v-btn text color="red" @click="cancelEdit">취소</v-btn>
    </v-row>

    <!-- 상품 수정 Form -->
    <product-edit-form v-if="product" @submitProduct="updateProduct" :initialProduct="product"
      :categories="categories" :nutrients="nutrients" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductEditForm from '../../../components/seller/product/ProductEditForm.vue';
import api from '../../../api/axios';

const route = useRoute();
const router = useRouter();
const categories = ref([]);
const nutrients = ref([]);
const product = ref(null);


//  API를 통해 카테고리 및 영양소 목록 가져오기
const fetchCategoriesAndNutrients = async () => {
  try {
    const categoryResponse = await api.get('/products/categories');
    categories.value = categoryResponse.data;

    const nutrientResponse = await api.get('/products/nutrients');
    nutrients.value = nutrientResponse.data;
  } catch (error) {
    console.error('카테고리 및 영양소 목록 불러오기 실패:', error.response?.data || error.message);
    alert('카테고리 및 영양소 목록을 불러오지 못했습니다.');
  }
};

// 상품 상세 정보를 가져오는 함수 (productId를 기반으로)
const fetchProductDetails = async () => {
  const productId = route.params.productId;
  if (!productId) {
    alert('상품 ID가 없습니다.');
    router.push('/seller/product');
    return;
  }

  try {
    const response = await api.get(`/products/${productId}`);
    product.value = {
      ...response.data,
      categoryId: response.data.category?.categoryId || null,
      nutrientId: response.data.nutrient?.nutrientId || null,
    };
  } catch (error) {
    console.error('상품 정보를 불러오는 데 실패했습니다.', error);
    alert('상품 정보를 불러오지 못했습니다.');
    router.push('/seller/product');
  } 
};

// 초기 데이터 불러오기
onMounted(async () => {
  await fetchProductDetails();
  await fetchCategoriesAndNutrients();
});

// 이전 페이지로 돌아가기
const goBack = () => router.push(`/seller/product/${route.params.productId}`);
const cancelEdit = () => router.push(`/seller/product/${route.params.productId}`);

// 상품 수정 API 호출
const updateProduct = async (updatedProduct) => {
  try {
    await api.put(`/products/${updatedProduct.productId}`, updatedProduct);
    alert('상품 정보가 성공적으로 수정되었습니다.');
    router.push(`/seller/product/${updatedProduct.productId}`);
  } catch (error) {
    console.error('상품 수정 실패:', error.response?.data || error.message);
    alert('상품 정보 수정에 실패했습니다.');
  }
};
</script>

<style scoped></style>