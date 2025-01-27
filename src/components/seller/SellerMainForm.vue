<template>
    <v-container>
        <!-- 행 간격 추가 -->
        <v-row style="row-gap: 60px;">
            <!-- 상품 데이터 반복 렌더링 -->
            <v-col v-for="product in props.products" :key="product.productId" cols="12" md="4">
                <!-- 상품 카드 -->
                <v-card class="product-card">
                    <!-- 상품 이미지 -->
                    <v-img :src="product.thumbnailImage" alt="제품 이미지" height="200" class="product-image"
                        @error="handleImageError"></v-img>

                    <!-- 상품 정보 -->
                    <v-card-title class="product-title">{{ product.productName }}</v-card-title> <!-- 상품 이름 -->
                    <v-card-subtitle class="product-subtitle">회사명: {{ product.companyName }}</v-card-subtitle>
                    <!-- 회사명 -->
                    <v-card-subtitle class="product-subtitle">카테고리: {{ product.category }}</v-card-subtitle>
                    <!-- 카테고리 -->
                    <v-card-subtitle class="product-subtitle">가격: {{ product.price.toLocaleString()
                        }}원</v-card-subtitle> <!-- 가격 -->
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import "../../assets/styles/main.css"
import { defineProps } from "vue";

// 부모 컴포넌트에서 전달받는 props 정의
const props = defineProps({
    products: {
        type: Array, // 상품 리스트 배열
        required: true, // 필수 값
    },
});

// 이미지 로드 실패 시 기본 이미지로 교체
const handleImageError = (event) => {
    console.log("이미지 로드 실패:", event.target.src); // 실패한 이미지 URL 출력
    event.target.src = "https://via.placeholder.com/150"; // 기본 이미지로 교체
};
</script>

<style scoped>


</style>
