<template>
  <v-container>
    <!-- 상품 필터 버튼 -->
    <v-row class="mb-4">
      <!-- 판매 상태별 필터 버튼 (예: 전체, 판매중, 품절, 삭제됨) -->
      <v-btn 
        v-for="filter in filters" 
        :key="filter.name" 
        :color="filter.active ? 'green' : 'grey'" 
        outlined
        class="mr-2" 
        @click="$emit('filter', filter.name)" 
      >
        {{ filter.label }}
      </v-btn>
    </v-row>

    <!-- 상품 리스트 -->
    <v-row>
      <v-col cols="12" v-for="product in products" :key="product.productId">
        <v-card class="mb-4">
          <v-row align-items="center">
            <!-- 상품 이미지 섹션 -->
            <v-col cols="2">
              <v-img :src="product.thumbnailImage" alt="상품 이미지" height="80"></v-img>
            </v-col>

            <!-- 상품 정보 섹션 -->
            <v-col cols="7" @click="$emit('viewProduct', product.productId)">
              <!-- 상품명 -->
              <h3>{{ product.productName }}</h3>
              <!-- 상품 가격 및 판매량 -->
              <p>
                {{ product.price.toLocaleString() }}원 |
                판매량: {{ product.salesCount }}개
              </p>
              <!-- 판매 상태 표시 -->
              <v-chip :color="product.status === '판매중' ? 'green' : 'red'" small>
                {{ product.status }}
              </v-chip>
            </v-col>

            <!-- 상품 삭제 버튼 -->
            <v-col cols="1" class="d-flex justify-end">
              <v-btn 
                icon 
                color="red" 
                @click="$emit('deleteProduct', product.productId)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 상품 추가 버튼 (우측 하단 고정) -->
    <v-btn 
      color="green" 
      fab 
      bottom 
      right 
      class="fixed" 
      @click="$emit('addProduct')"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

// 부모 컴포넌트에서 발생하는 이벤트 정의
const emit = defineEmits([
  'filter', // 필터 버튼 클릭 시 이벤트 발생
  'viewProduct', // 상품 상세보기 클릭 시 이벤트 발생
  'deleteProduct', // 상품 삭제 버튼 클릭 시 이벤트 발생
  'addProduct' // 상품 추가 버튼 클릭 시 이벤트 발생
]);

// 부모 컴포넌트에서 전달받는 props 정의
defineProps({
  products: {
    type: Array, // 상품 목록 데이터 배열
    required: true, // 필수값
  },
  filters: {
    type: Array, // 필터 옵션 배열 (예: 전체, 판매중, 품절 등)
    required: true, // 필수값
  }
});
</script>

<style scoped>
/* 상품 추가 버튼을 화면 우측 하단에 고정 */
.fixed {
  position: fixed;
  bottom: 16px;
  right: 16px;
}
</style>
