<template>
  <v-app>
    <!-- 판매자 네비게이션 바 -->
    <seller-navigation-bar/>

    <!-- 상품 리스트 화면 -->
    <v-main>
      <!-- 판매자의 상품 리스트를 표시하는 폼 컴포넌트 -->
      <seller-my-form 
        :products="filteredProducts" 
        :filters="filters" 
        @filter="applyFilter"
        @viewProduct="viewProductDetail" 
        @deleteProduct="deleteProduct" 
        @addProduct="goToAddProduct" 
      />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../../../api/axios"; // API 호출을 위한 axios 인스턴스
import SellerMyForm from "../../../components/seller/product/SellerMyForm.vue"; // 상품 리스트를 표시하는 폼
import SellerNavigationBar from "../SellerNavigationBar.vue"; // 판매자 네비게이션 바
import router from "../../../router"; // 라우터 사용

// 상품 데이터 및 필터 상태 관리
const products = ref([]); // 전체 상품 목록
const filters = ref([
  { name: "all", label: "전체", active: true }, // 모든 상품
  { name: "selling", label: "판매 중", active: false }, // 판매 중인 상품
  { name: "sold_out", label: "품절", active: false }, // 품절된 상품
  { name: "deleted", label: "삭제된 상품", active: false }, // 삭제된 상품
]);
const currentFilter = ref("all"); // 현재 선택된 필터 상태

// 선택된 필터에 따라 상품을 필터링하는 computed 속성
const filteredProducts = computed(() => {
  switch (currentFilter.value) {
    case "selling":
      return products.value.filter((product) => product.status === "SELLING"); // 판매 중 상품 필터링
    case "sold_out":
      return products.value.filter((product) => product.status === "SOLD_OUT"); // 품절 상품 필터링
    case "deleted":
      return products.value.filter((product) => product.status === "DELETED"); // 삭제된 상품 필터링
    default:
      return products.value; // 전체 상품 리스트 반환
  }
});

// 서버에서 상품 목록을 가져오는 함수
const fetchProducts = async () => {
  try {
    const response = await api.get("/users/sellers/products"); // 판매자의 상품 목록 요청
    products.value = response.data.content; // 응답 데이터를 products 상태에 저장
  } catch (error) {
    console.error("상품 목록 불러오기 실패:", error.response?.data || error.message);
    alert("상품 목록을 불러올 수 없습니다.");
  }
};

// 필터 변경 시 실행되는 함수
const applyFilter = (filterName) => {
  // 모든 필터의 활성화 상태를 초기화 후 선택한 필터만 활성화
  filters.value.forEach((filter) => {
    filter.active = filter.name === filterName;
  });
  currentFilter.value = filterName; // 현재 선택된 필터 업데이트
};

// 상품 상세 페이지로 이동하는 함수
const viewProductDetail = (productId) => {
  router.push(`/seller/product/${productId}`); // 상품 상세 페이지로 이동
};

// 상품 삭제 요청을 서버에 보내는 함수
const deleteProduct = async (productId) => {
  alert(`${productId}번 상품을 삭제합니다.`); // 사용자 확인 메시지
  try {
    await api.delete(`/products/${productId}`); // 서버에 상품 삭제 요청
  } catch (error) {
    console.log('삭제 실패 : ', error.response?.data || error.message);
  }
};

// 상품 추가 페이지로 이동하는 함수
const goToAddProduct = () => {
  router.push("/seller/product/add"); // 상품 등록 페이지로 이동
};

// 컴포넌트가 마운트될 때 상품 데이터를 불러옴
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
/* 화면 오른쪽 하단 고정 버튼 스타일 */
.fixed {
  position: fixed;
  bottom: 16px;
  right: 16px;
}
</style>
