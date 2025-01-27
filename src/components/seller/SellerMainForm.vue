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
/* 카드 스타일 */
.product-card {
    width: 350px;
    /* 카드 크기 조정 */
    margin: 0 auto;
    /* 중앙 정렬 */
    border: 1px solid #e0e0e0;
    /* 카드 경계선 추가 */
    border-radius: 10px;
    /* 모서리 둥글게 */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* 카드 그림자 추가 */
    overflow: hidden;
    /* 카드 내부 이미지 잘림 방지 */
    background-color: #ffffff;
    /* 카드 배경색 */
    transition: transform 0.2s ease-in-out;
    /* 카드 호버 애니메이션 */
}

/* 카드 호버 시 효과 */
.product-card:hover {
    transform: translateY(-5px);
    /* 약간 위로 올라가는 효과 */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    /* 그림자 강조 */
}

/* 이미지 스타일 */
.product-image {
    border-bottom: 1px solid #e0e0e0;
    /* 이미지 하단 경계선 */
}

/* 텍스트 스타일 */
.product-title {
    font-weight: bold;
    /* 제목 강조 */
    font-size: 18px;
    /* 제목 크기 */
    margin-bottom: 10px;
    /* 아래 여백 추가 */
}

.product-subtitle {
    font-size: 14px;
    /* 부제목 크기 */
    color: #555555;
    /* 부제목 색상 */
    margin-bottom: 5px;
    /* 아래 여백 추가 */
}

/* 전체 행 간격 */
v-row {
    row-gap: 60px;
    /* 행 간격 */
}
</style>
