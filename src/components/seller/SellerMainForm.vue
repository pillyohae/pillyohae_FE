<template>
    <v-container>
        <v-row>
            <v-col v-for="product in props.products" :key="product.productId" cols="12" md="4">
                <v-card>
                    <v-img :src="product.thumbnailImage" alt="제품 이미지"
                        height="150" @error="handleImageError"></v-img>
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

const props = defineProps({
    products: {
        type: Array,
        required: true,
    }
})


const handleImageError = (event) => {
  console.log('이미지 로드 실패:', event.target.src);
  event.target.src = 'https://via.placeholder.com/150'; // 기본 이미지로 교체
};

</script>


<style></style>