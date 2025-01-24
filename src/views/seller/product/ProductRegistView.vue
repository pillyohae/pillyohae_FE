<template>
    <v-app>
        <seller-navigation-bar/>

        <!-- 상품 등록 Form -->
        <v-main>
            <product-regist-form />
        </v-main>
    </v-app>
</template>

<script setup>
import ProductRegistForm from '../../../components/seller/product/ProductRegistForm.vue';
import SellerNavigationBar from '../SellerNavigationBar.vue';

</script>
