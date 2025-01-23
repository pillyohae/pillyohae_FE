<template>
    <v-app>
        <!-- 내비게이션 바 -->
    <v-app-bar app>
      <v-toolbar-title>Pill요해?</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- 네비게이션 메뉴 -->
      <v-btn text to="/buyer">홈</v-btn>
      <v-btn text to="/survey">설문</v-btn>
      <v-btn text to="/cart">장바구니</v-btn>
      <v-btn text to="/mypage">마이페이지</v-btn>
      <!-- 로그아웃 버튼 -->
      <v-btn text color="red" @click="performLogout ">로그아웃</v-btn>
    </v-app-bar>

        <!-- 상품 상세 Form -->
        <v-main>
            <div v-if="product">
                <BuyerProductForm :product="product" />
            </div>
            <div v-else class="text-center my-5">
                <v-progress-circular indeterminate color="green"></v-progress-circular>
                <p>상품 정보를 불러오는 중...</p>
            </div>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "../../../api/axios";
import BuyerProductForm from "../../../components/buyer/product/BuyerProductForm.vue";

const route = useRoute();
const product = ref(null);

// 상품 상세 정보 요청
const fetchProductDetails = async () => {
    try {
        const productId = route.params.productId;
        const response = await api.get(`/products/${productId}`);
        product.value = response.data;
    } catch (error) {
        console.error("상품 상세 정보 요청 실패:", error.response?.data || error.message);
        alert("상품 정보를 불러오지 못했습니다.");
    }
};

onMounted(fetchProductDetails);
</script>
