<template>
  <v-app>
    <!-- 공통 네비게이션 바 컴포넌트 -->
    <buyer-navigation-bar />

   
    <v-main class="main-background">
       <!-- 검색창 -->
      <v-container class="search-container mt-4">
        <v-row align-center justify="space-between">
          <!-- 검색 조건 선택 -->
          <v-col cols="6" md="2">
            <v-select
              v-model="searchType"
              :items="searchOptions"
              label="검색 조건"
              outlined
              dense
              hide-details
            />
          </v-col>

          <!-- 검색어 입력 -->
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              label="검색어를 입력하세요"
              outlined
              dense
              hide-details
            />
          </v-col>

          <!-- 검색 버튼 -->
          <v-col cols="6" md="1">
            <v-btn color="green" block @click="onSearch">검색</v-btn>
          </v-col>

          <!-- 정렬 기준 선택 -->
          <v-col cols="6" md="2">
            <v-select
  v-model="selectedSort"
  :items="sortOptions"
  item-title="label"
  item-value="value"
  label="정렬 조건"
  outlined
  dense
  hide-details
/>

          </v-col>
        </v-row>
      </v-container>

      <!-- 상품 목록 -->
      <v-container class="buyer-main-view mt-4">
        <ProductForm :products="filteredProducts" />
      </v-container>

      <!-- 페이지네이션 -->
      <v-pagination
        :model-value="currentPage"
        :length="totalPages"
        @update:model-value="updatePage"
        class="main-pagination mt-4"
      />
    </v-main>
  </v-app>
</template>

<script setup>
import BuyerNavigationBar from './BuyerNavigationBar.vue';
import ProductForm from '../../components/buyer/BuyerMainForm.vue';
import { ref, onMounted, computed, watch, reactive } from 'vue'; // 반응형 상태와 라이프사이클 훅
import api from '../../api/axios'; // 서버와 통신을 위한 Axios

// 검색 및 정렬 상태 관리
const searchType = ref(''); // 검색 조건 선택
const searchQuery = ref(''); // 검색어
// sortBy와 isAsc를 computed로 정의하여 selectedSort 변경 시 자동 반영
const sortBy = computed(() => selectedSort.value.sortBy);
const isAsc = computed(() => selectedSort.value.isAsc);

// 검색 및 정렬 옵션
const searchOptions = ['판매사 이름', '제품 이름', '카테고리'];
const sortState = reactive({
  sortBy: 'productId',
  isAsc: false,
});

const sortOptions = [
  { label: '업로드 최신순', value: { sortBy: 'productId', isAsc: false } },
  { label: '업로드 과거순', value: { sortBy: 'productId', isAsc: true } },
  { label: '가격 높은 순', value: { sortBy: 'price', isAsc: false } },
  { label: '가격 낮은 순', value: { sortBy: 'price', isAsc: true } },
];

// 상품 데이터 및 페이지네이션
const cachedPages = ref({}); // 캐시된 페이지 데이터 저장 객체
const allProducts = ref([]); // 전체 상품 데이터
const currentPage = ref(1); // 현재 페이지 번호 (1 기반)
const totalPages = ref(1); // 전체 페이지 수
const pageSize = 6; // 한 페이지당 표시할 상품 수

// 현재 페이지에 표시할 상품 계산
const filteredProducts = computed(() => {
  return allProducts.value; // 현재 페이지에 해당하는 상품 반환
});

const selectedSort = ref(sortOptions[0].value);

watch(selectedSort, (newSort) => {
  sortState.sortBy = newSort.sortBy;
  sortState.isAsc = newSort.isAsc;
});

// API 요청 파라미터 생성
const getApiParams = () => {
  const params = {
    page: currentPage.value,
    size: pageSize,
    sortBy: sortBy.value,
    isAsc: isAsc.value,
  };

  if (searchType.value && searchQuery.value) {
    if (searchType.value === '판매사 이름') {
      params.companyName = searchQuery.value;
    } else if (searchType.value === '제품 이름') {
      params.productName = searchQuery.value;
    } else if (searchType.value === '카테고리') {
      params.category = searchQuery.value;
    }
  }

  return params;
};

// 서버로부터 상품 데이터를 가져오는 함수
const fetchProducts = async () => {
  const params = getApiParams();

  // 캐시에 현재 페이지 데이터가 존재할 경우 캐시에서 가져옴
  const cacheKey = JSON.stringify(params);
  if (cachedPages.value[cacheKey]) {
    allProducts.value = cachedPages.value[cacheKey];
    return;
  }

  try {
    // API 호출하여 상품 데이터 가져오기
    const response = await api.get(`/products/search`, { params });

    // 판매 중인 상품만 필터링
    const products = response.data.content.filter((product) => product.status === 'SELLING');
    allProducts.value = products; // 상품 데이터 저장

    // 가져온 데이터를 캐시에 저장
    cachedPages.value[cacheKey] = products;
    totalPages.value = response.data.totalPages; // 전체 페이지 수 업데이트
  } catch (error) {
    // API 호출 실패 시 에러 처리
    console.error('상품 목록 불러오기 실패 : ', error.response?.data || error.message);
    alert('상품 목록을 불러오지 못했습니다.');
  }
};

// 검색 버튼 클릭 시 호출
const onSearch = () => {
  currentPage.value = 1; // 검색 시 페이지를 1로 초기화
  cachedPages.value = {}; // 검색 조건 변경 시 캐시 초기화
  fetchProducts(); // 새로운 조건으로 데이터 요청
};

// 페이지 변경 이벤트
const updatePage = (page) => {
  currentPage.value = page; // 현재 페이지 값 업데이트
  fetchProducts(); // 새로운 페이지 데이터를 요청
};

// 컴포넌트 마운트 시 초기 데이터 가져오기
onMounted(() => {
  fetchProducts(); // 첫 페이지 데이터 요청
});
</script>


<style scope>
/* 전체 배경색 적용 */
.main-background {
  background-color: #f5f5f5 !important;  /* 연한 회색 */
  min-height: 100vh; /* 최소 높이를 화면 전체로 설정 */
}

.search-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px 20px;
}

.buyer-main-view {
  background-color: #f5f5f5;
  min-height: 80vh;
}

.main-pagination {
  background-color: white;
}
</style>