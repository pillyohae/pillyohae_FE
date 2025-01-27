<template>
  <v-app>
    <!-- 공통 네비게이션 바 컴포넌트 -->
    <buyer-navigation-bar />

    <!-- 상품 목록 -->
    <v-main style="margin-top: 20px;" class="buyer-main-view">
      <!-- BuyerProductFormView 컴포넌트를 사용하여 상품 표시 
         Vue의 props를 통해 부모에서 자식으로 데이터를 전달하는 방식
         :products는 부모의 products 데이터를 자식 컴포넌트 ProductForm의 props로 전달-->
      <ProductForm :products="filteredProducts" />
    </v-main>

    <!-- 페이지네이션 버튼 -->
    <v-pagination
            :model-value="currentPage" 
            :length="totalPages" 
            @update:model-value="updatePage" 
            class="mt-4"
        ></v-pagination>
  </v-app>
</template>

<script setup>
import BuyerNavigationBar from './BuyerNavigationBar.vue';
import { ref, onMounted, computed } from 'vue'; // 반응형 상태와 라이프사이클 훅
import ProductForm from '../../components/buyer/BuyerMainForm.vue'; // 상품 표시 컴포넌트
import api from '../../api/axios'; // 서버와 통신을 위한 Axios

const cachedPages = ref({}); // 캐시된 페이지 데이터 저장 객체
const allProducts = ref([]); // 전체 상품 데이터
const currentPage = ref(1); // 현재 페이지 번호 (1 기반)
const totalPages = ref(1); // 전체 페이지 수
const pageSize = 6; // 한 페이지당 표시할 상품 수

// 현재 페이지에 표시할 상품 계산
const filteredProducts = computed(() => {
    return allProducts.value; // 현재 페이지에 해당하는 상품 반환
});

// 페이지 변경 이벤트
const updatePage = (page) => {
    currentPage.value = page; // 현재 페이지 값 업데이트
    fetchProducts(); // 새로운 페이지 데이터를 요청
};

// 서버로부터 상품 데이터를 가져오는 함수
const fetchProducts = async () => {
    // 캐시에 현재 페이지 데이터가 존재할 경우 캐시에서 가져옴
    if (cachedPages.value[currentPage.value]) {
        allProducts.value = cachedPages.value[currentPage.value];
        return;
    }

    try {
        // API 호출하여 상품 데이터 가져오기
        const response = await api.get(`/products/search`, {
            params: {
                page: currentPage.value, // 현재 페이지 번호
                size: pageSize, // 페이지 크기
            },
        });

        // 판매 중인 상품만 필터링
        const products = response.data.content.filter((product) => product.status === 'SELLING');
        allProducts.value = products; // 상품 데이터 저장

        // 가져온 데이터를 캐시에 저장
        cachedPages.value[currentPage.value] = products;
        totalPages.value = response.data.totalPages; // 전체 페이지 수 업데이트
    } catch (error) {
        // API 호출 실패 시 에러 처리
        console.error('상품 목록 불러오기 실패 : ', error.response?.data || error.message);
        alert('상품 목록을 불러오지 못했습니다.');
    }
};

// 컴포넌트 마운트 시 초기 데이터 가져오기
onMounted(() => {
    fetchProducts(); // 첫 페이지 데이터 요청
});
</script>

<style scope>
/* 배경색을 연한 회색으로 설정 */
.buyer-main-view {
    background-color: #f5f5f5;
    /* 연한 회색 */
    min-height: 80vh;
    /* 화면 전체 높이 */
}
</style>