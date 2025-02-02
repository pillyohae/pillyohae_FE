// composables/useProducts.js
import { ref, computed, watch } from "vue";
import api from '../../api/axios'

export function useProducts() {
  const cachedPages = ref({}); // 페이지 데이터 캐싱
  const allProducts = ref([]); // 상품 데이터 저장
  const currentPage = ref(1); // 현재 페이지 번호
  const totalPages = ref(1); // 전체 페이지 수
  const pageSize = 6; // 한 페이지당 표시할 상품 수

  // 검색 및 정렬 상태 관리
  const searchType = ref(""); // 검색 기준
  const searchQuery = ref(""); // 검색어 입력
  const selectedSort = ref({ sortBy: "productId", isAsc: false });

  const sortOptions = [
    { label: "업로드 최신순", value: { sortBy: "productId", isAsc: false } },
    { label: "업로드 과거순", value: { sortBy: "productId", isAsc: true } },
    { label: "가격 높은 순", value: { sortBy: "price", isAsc: false } },
    { label: "가격 낮은 순", value: { sortBy: "price", isAsc: true } },
  ];

  const searchOptions = ["판매사 이름", "제품 이름", "카테고리"];

  // 현재 페이지의 상품 목록 (정렬, 검색 적용)
  const filteredProducts = computed(() => allProducts.value);

  // 검색 및 정렬에 따라 API 요청 파라미터 생성
  const getApiParams = () => {
    const params = {
      page: currentPage.value,
      size: pageSize,
      sortBy: selectedSort.value.sortBy,
      isAsc: selectedSort.value.isAsc,
    };

    if (searchType.value && searchQuery.value) {
      if (searchType.value === "판매사 이름") {
        params.companyName = searchQuery.value;
      } else if (searchType.value === "제품 이름") {
        params.productName = searchQuery.value;
      } else if (searchType.value === "카테고리") {
        params.category = searchQuery.value;
      }
    }

    return params;
  };

  // 상품 목록을 서버에서 가져오는 함수
  const fetchProducts = async () => {
    const params = getApiParams();
    const cacheKey = JSON.stringify(params);

    if (cachedPages.value[cacheKey]) {
      allProducts.value = cachedPages.value[cacheKey];
      return;
    }

    try {
      const response = await api.get(`/products/search`, { params });
      const products = response.data.content.filter((p) => p.status === "SELLING");
      allProducts.value = products;
      cachedPages.value[cacheKey] = products;
      totalPages.value = response.data.totalPages;
    } catch (error) {
      console.error("상품 목록 불러오기 실패:", error);
      alert("상품 목록을 불러오지 못했습니다.");
    }
  };

  // 검색 실행 함수
  const onSearch = () => {
    currentPage.value = 1;
    cachedPages.value = {}; // 캐시 초기화
    fetchProducts();
  };

  // 페이지 변경 함수
  const updatePage = (page) => {
    currentPage.value = page;
    fetchProducts();
  };

  watch(selectedSort, fetchProducts); // 정렬 변경 감지하여 다시 가져오기

  return {
    searchType,
    searchQuery,
    selectedSort,
    sortOptions,
    searchOptions,
    filteredProducts,
    currentPage,
    totalPages,
    updatePage,
    onSearch,
    fetchProducts,
  };
}
