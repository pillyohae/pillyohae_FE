<template>
  <v-app>
    <seller-navigation-bar/>

    <!-- 상품 리스트 -->
    <v-main>
      <seller-my-form :products="filteredProducts" :filters="filters" @filter="applyFilter"
        @viewProduct="viewProductDetail" @deleteProduct="deleteProduct" @addProduct="goToAddProduct" />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../../../api/axios";
import SellerMyForm from "../../../components/seller/product/SellerMyForm.vue";
import SellerNavigationBar from "../SellerNavigationBar.vue";
import { logout } from "../../../utils/auth";
import router from "../../../router";

// 상품 데이터 및 필터 상태 관리
const products = ref([]); // 전체 상품 데이터
const filters = ref([
  { name: "all", label: "전체", active: true },
  { name: "selling", label: "판매 중", active: false },
  { name: "sold_out", label: "품절", active: false },
  { name: "deleted", label: "삭제된 상품", active: false },
]);
const currentFilter = ref("all"); // 현재 선택된 필터

// 선택된 필터에 따라 상품 필터링
const filteredProducts = computed(() => {
  switch (currentFilter.value) {
    case "selling":
      return products.value.filter((product) => product.status === "SELLING");
    case "sold_out":
      return products.value.filter((product) => product.status === "SOLD_OUT");
    case "deleted":
      return products.value.filter((product) => product.status === "DELETED");
    default:
      return products.value; // 전체 상품
  }
});

// 상품 목록 가져오기
const fetchProducts = async () => {
  try {
    const response = await api.get("/users/sellers/products");
    
    products.value = response.data.content;
  } catch (error) {
    console.error("상품 목록 불러오기 실패:", error.response?.data || error.message);
    alert("상품 목록을 불러올 수 없습니다.");
  }
};

// 필터 변경
const applyFilter = (filterName) => {
  filters.value.forEach((filter) => {
    filter.active = filter.name === filterName;
  });
  currentFilter.value = filterName;
};

// 상품 상세보기로 이동
const viewProductDetail = (productId) => {
  router.push(`/seller/product/${productId}`);
};

// 상품 삭제
const deleteProduct = async (productId) => {
  alert(`${productId}번 상품을 삭제합니다.`);
  try {
    const response = await api.delete(`/products/${productId}`);
  } catch (error) {
    console.log('삭제 실패 : ', error.response?.data || error.message);
  }
};

// 상품 등록 페이지로 이동
const goToAddProduct = () => {
  router.push("/seller/product/add");
};

// 로그아웃 처리
const performLogout = async () => {
  await logout();
};

// 컴포넌트가 마운트되면 상품 데이터 가져오기
onMounted(() => {
  fetchProducts();
});
</script>

<style scoped>
.fixed {
  position: fixed;
  bottom: 16px;
  right: 16px;
}
</style>
