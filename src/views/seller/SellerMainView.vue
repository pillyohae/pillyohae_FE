<template>
    <v-app>
        <!-- 판매자 네비게이션 바 -->
        <seller-navigation-bar />

        <v-main style="margin-top: 50px;" class="seller-main-view">
            <!-- 현재 페이지 제품 리스트를 SellerProductForm 컴포넌트에 전달 -->
            <seller-product-form :products="filteredProducts"></seller-product-form>
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
import SellerProductForm from '../../components/seller/SellerMainForm.vue'; // 상품 리스트를 출력하는 컴포넌트
import SellerNavigationBar from './SellerNavigationBar.vue'; // 판매자 네비게이션 바 컴포넌트
import api from '../../api/axios'; // API 요청을 위한 Axios 모듈
import { ref, computed, onMounted } from 'vue'; // Vue Composition API 사용

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

<style scoped>
/* 페이지네이션 버튼 중앙 정렬 */
.v-pagination {
    justify-content: center;
}

/* 배경색을 연한 회색으로 설정 */
.seller-main-view {
    background-color: #f5f5f5;
    /* 연한 회색 */
    
    min-height: 80vh;
    /* 화면 전체 높이 */
}
</style>
