<template>
  <v-container>
    <!-- 이미지 캐러셀 섹션 -->
    <v-row justify="center" class="my-4">
      <v-carousel hide-delimiters>
        <!-- 상품 이미지들을 캐러셀 형식으로 표시 -->
        <v-carousel-item
          v-for="(image, index) in sortedImages"
          :key="index"
          :src="image.imageUrl"
        ></v-carousel-item>
      </v-carousel>
    </v-row>

    <!-- 상품 기본 정보 섹션 -->
    <v-row justify="center" class="my-4">
      <v-col cols="12" class="text-center">
        <!-- 상품명 -->
        <h1 class="product-name">{{ product.productName }}</h1>
        <!-- 회사명 -->
        <p class="company-name">{{ product.companyName }}</p>
        <!-- 가격 -->
        <p class="price">{{ formatPrice(product.price) }}</p>
      </v-col>
    </v-row>

    <!-- 상세정보 탭 -->
    <v-row justify="center" class="my-4">
      <v-col cols="12" md="8">
        <!-- 상세정보 탭 버튼 -->
        <v-tabs v-model="tab" color="green">
          <v-tab>상세정보</v-tab>
        </v-tabs>
        <!-- 탭 내부 내용 -->
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <!-- 상품 설명 -->
            <p class="product-description">
              {{ product.description }}
            </p>
            <!-- 카테고리 정보 -->
            <h3 class="category-title">카테고리</h3>
            <p>{{ product.category }}</p>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { defineProps, ref, computed } from 'vue';

// 부모 컴포넌트에서 전달받은 상품 데이터
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// 탭 상태 관리 (기본적으로 첫 번째 탭 선택)
const tab = ref(0);

// 상품 이미지들을 정렬 (position 속성 기준으로 정렬)
const sortedImages = computed(() => {
  return [...props.product.images].sort((a, b) => a.position - b.position);
});

// 가격을 한국 원(KRW) 형식으로 변환하는 함수
const formatPrice = (price) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
};
</script>

<style scoped>
/* 상품명 스타일 */
.product-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* 회사명 스타일 */
.company-name {
  color: #666;
  margin-bottom: 10px;
}

/* 가격 스타일 */
.price {
  font-size: 20px;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 20px;
}

/* 상세정보 설명 스타일 */
.product-description {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* 카테고리 제목 스타일 */
.category-title {
  font-weight: bold;
  margin-top: 20px;
}
</style>
