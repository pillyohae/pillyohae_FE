<template>
    <v-app>
        <seller-navigation-bar/>
        <v-main>
            <seller-product-form :products="products"></seller-product-form>
        </v-main>
    </v-app>
</template>

<script setup>
import SellerProductForm from '../../components/seller/SellerMainForm.vue'
import SellerNavigationBar from './SellerNavigationBar.vue';
import api from '../../api/axios'
import { onMounted, ref } from 'vue';

const products = ref([]);

const fetchProducts = async () => {
    try {
        const response = await api.get('/products/search');
        console.log(response.data.content);
        products.value = response.data.content.filter((product) => product.status === 'SELLING');
    } catch (error) {
        console.error('상품 목록 불러오기 실패 : ', error.response?.data || error.message);
        alert('상품 목록을 불러오지 못했습니다.');
    }

}

onMounted(() => {
    fetchProducts();
})
</script>


<style></style>