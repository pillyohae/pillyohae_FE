<template>
    <v-container>
      <!-- 이미지 캐러셀 -->
      <v-row justify="center" class="my-4">
        <v-carousel hide-delimiters>
          <v-carousel-item
            v-for="(image, index) in product.imageUrls"
            :key="index"
            :src="image"
          ></v-carousel-item>
        </v-carousel>
      </v-row>
  
      <!-- 상품 정보 -->
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
            <v-tab>상세정보</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item>
              <p class="product-description">
                {{ product.description }}
              </p>
              <h3 class="category-title">카테고리</h3>
              <p>{{ product.category }}</p>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
  
    
    </v-container>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { defineProps, ref } from 'vue';
  
  const props = defineProps({
    product: {
      type: Object,
      required: true,
    },
  });
  
  const tab = ref(0);
  
  const router = useRouter();
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(price);
  };
  
  </script>
  
  <style scoped>
  /* 상품 정보 스타일 */
  .product-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .company-name {
    color: #666;
    margin-bottom: 10px;
  }
  
  .price {
    font-size: 20px;
    font-weight: bold;
    color: #4caf50;
    margin-bottom: 20px;
  }
  
  /* 상세정보 섹션 */
  .product-description {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  .category-title {
    font-weight: bold;
    margin-top: 20px;
  }

  </style>
  