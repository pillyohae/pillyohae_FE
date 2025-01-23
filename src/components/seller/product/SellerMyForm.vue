<template>
  <v-container>
    <!-- 상품 필터 버튼 -->
    <v-row class="mb-4">
      <v-btn v-for="filter in filters" :key="filter.name" :color="filter.active ? 'green' : 'grey'" outlined
        class="mr-2" @click="$emit('filter', filter.name)">
        {{ filter.label }}
      </v-btn>
    </v-row>

    <!-- 상품 리스트 -->
    <v-row>
      <v-col cols="12" v-for="product in products" :key="product.productId">
        <v-card class="mb-4">
          <v-row align-items="center">
            <!-- 상품 이미지 -->
            <v-col cols="2">
              <v-img :src="product.thumbnailImage" alt="상품 이미지" height="80"></v-img>
            </v-col>

            <!-- 상품 정보 -->
            <v-col cols="7" @click="$emit('viewProduct', product.productId)">
              <h3>{{ product.productName }}</h3>
              <p>
                {{ product.price.toLocaleString() }}원 |
                판매량: {{ product.salesCount }}개
              </p>
              <v-chip :color="product.status === '판매중' ? 'green' : 'red'" small>
                {{ product.status }}
              </v-chip>
            </v-col>

            <!-- 삭제 버튼 -->
            <v-col cols="1" class="d-flex justify-end">
              <v-btn icon color="red" @click="$emit('deleteProduct', product.productId)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 상품 추가 버튼 -->
    <v-btn color="green" fab bottom right class="fixed" @click="$emit('addProduct')">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits(['filter', 'viewProduct', 'deleteProduct', 'addProduct']);

defineProps({
  products: {
    type: Array,
    required: true,
  },
  filters: {
    type: Array,
    required: true,
  }
})
</script>

<style scoped>
.fixed {
  position: fixed;
  bottom: 16px;
  right: 16px;
}
</style>
