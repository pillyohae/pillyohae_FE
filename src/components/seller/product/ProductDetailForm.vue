<template>
  <v-container>
    <!-- 이미지 캐러셀 섹션 -->
    <v-row justify="center" class="my-4">
      <v-carousel hide-delimiters>
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
        <h1 class="product-name">{{ product.productName }}</h1>
        <p class="company-name">{{ product.companyName }}</p>
        <p class="price">{{ formatPrice(product.price) }}</p>
      </v-col>
    </v-row>

    <!-- 상세정보 탭 -->
    <v-row justify="center" class="my-4">
      <v-col cols="12" md="8">
        <v-tabs v-model="tab" color="green">
          <v-tab :value="0">상품 설명</v-tab>
          <v-tab :value="1">카테고리</v-tab>
          <v-tab :value="2">영양 성분</v-tab>
        </v-tabs>

        <!-- 탭 클릭 시 해당 내용만 보이도록 설정 -->
        <div v-if="tab === 0">
          <h3 class="section-title">상품 설명</h3>
          <p class="product-description">{{ product.description }}</p>
        </div>

        <div v-if="tab === 1">
          <h3 class="section-title">카테고리</h3>
          <p>{{ product.category?.name || '정보 없음' }}</p>
        </div>

        <div v-if="tab === 2">
          <h3 class="section-title">영양 성분</h3>
          <p>{{ product.nutrient?.name || '정보 없음' }}</p>
          <p class="nutrient-description">{{ product.nutrient?.description || '' }}</p>
        </div>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup>
import { defineProps, ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const tab = ref(0); // 선택된 탭 값 (기본값: 상품 설명 탭)

// 상품 이미지 정렬
const sortedImages = computed(() => {
  return [...props.product.images].sort((a, b) => a.position - b.position);
});

// 가격 형식 변환
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

/* 섹션 타이틀 스타일 */
.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
}
</style>
