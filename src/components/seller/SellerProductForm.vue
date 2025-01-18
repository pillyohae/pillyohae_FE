<template>
    <v-container>
        <v-row>
            <v-col v-for="product in products" :key="product.productId" cols="12" md="4">
                <v-card>
                    <v-img :src="product.imageUrl || 'https://via.placeholder.com/150'" alt="제품 이미지"
                        height="150"></v-img>
                    <!-- 상품 이름, 회사, 카테고리, 가격 -->
                    <v-card-title>{{ product.productName }}</v-card-title>
                    <v-card-subtitle>회사명: {{ product.companyName }}</v-card-subtitle>
                    <v-card-subtitle>카테고리: {{ product.category }}</v-card-subtitle>
                    <v-card-subtitle>가격: {{ product.price.toLocaleString() }}원</v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    products: {
        type: Array,
        required: true,
    }
})
</script>


<style></style>