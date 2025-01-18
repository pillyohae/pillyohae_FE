<template>
    <v-app>
        <!-- 내비게이션 바 -->
        <v-app-bar app>
            <v-toolbar-title>Pill요해?</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- 네비게이션 메뉴 -->
            <v-btn text to="/seller">홈</v-btn>
            <v-btn text to="/seller/product">내 상품 보기</v-btn>
            <v-btn text to="#">요청 주문</v-btn>
            <!-- 로그아웃 버튼 -->
            <v-btn text color="red" @click="performLogout ">로그아웃</v-btn>
        </v-app-bar>


        <v-main>
            <seller-product-form :products="products"></seller-product-form>
        </v-main>
    </v-app>
</template>

<script setup>
import SellerProductForm from '../../components/seller/SellerProductForm.vue'
import api from '../../api/axios'
import { logout } from '../../utils/auth';
import { onMounted, ref } from 'vue';

const products = ref([]);

const fetchProducts = async () => {
    try {
        const response = await api.get('/products/search');
        console.log(response.data.content);
        products.value = response.data.content;
    } catch (error) {
        console.error('상품 목록 불러오기 실패 : ', error.response?.data || error.message);
        alert('상품 목록을 불러오지 못했습니다.');
    }

}

// 로그아웃 처리
const performLogout  = async () => {
        await logout();
};

onMounted(() => {
    fetchProducts();
})
</script>


<style></style>