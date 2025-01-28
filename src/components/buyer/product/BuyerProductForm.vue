<template>
    <v-container class="pb-10"> <!-- 하단에 여백 추가 -->
      <!-- 상품 이미지 캐러셀 -->
      <v-row justify="center" class="mb-6">
        <v-carousel hide-delimiters>
          <v-carousel-item
            v-for="(image, index) in sortedImages"
            :key="index"
            :src="image.imageUrl"
          ></v-carousel-item>
        </v-carousel>
      </v-row>
  
      <!-- 상품 정보 -->
      <v-row class="product-info mb-6">
        <v-col cols="12">
          <h2 class="font-weight-bold product-name">{{ product.productName }}</h2>
          <h4 class="grey--text product-company">{{ product.companyName }}</h4>
          <h3 class="font-weight-bold green--text product-price">
            {{ formatPrice(product.price) }}
          </h3>
        </v-col>
      </v-row>
  
      <!-- 수량 선택 -->
      <v-row justify="center" align-center class="quantity-selector mb-6">
        <v-btn icon @click="decrementQuantity">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <span class="mx-4 quantity-value">{{ quantity }}</span>
        <v-btn icon @click="incrementQuantity">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-row>
  
      <!-- 상세 정보 및 카테고리 -->
      <v-row justify="center" class="mb-6">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>상세정보</v-card-title>
            <v-card-text>
              <p class="product-description">{{ product.description }}</p>
              <h3 class="category-title">카테고리</h3>
              <p>{{ product.category }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 버튼 영역 -->
      <v-row justify="center" class="action-buttons fixed-bottom">
        <v-btn color="green" block @click="handlePurchase">구매하기</v-btn>
        <v-btn color="primary" block @click="addToCart">장바구니 담기</v-btn>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import api from "../../../api/axios";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const props = defineProps({
    product: {
      type: Object,
      required: true,
    },
  });
  
  // 이미지 정렬
  const sortedImages = computed(() => {
    return [...props.product.images].sort((a, b) => a.position - b.position);
  });
  
  const quantity = ref(1);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };
  
  const incrementQuantity = () => {
    quantity.value++;
  };
  
  const decrementQuantity = () => {
    if (quantity.value > 1) quantity.value--;
  };
  
  const addToCart = async () => {
    try {
      const payload = {
        productId: props.product.productId,
        quantity: quantity.value,
      };
      await api.post("/carts", payload);
      alert("장바구니에 추가되었습니다.");
    } catch (error) {
      console.error("장바구니 추가 실패:", error.response?.data || error.message);
      alert("장바구니 추가에 실패했습니다.");
    }
  };
  
  const handlePurchase = () => {
    const totalPriceValue = quantity.value * props.product.price;
  
    const selectedProduct = {
      productId: props.product.productId,
      productName: props.product.productName,
      price: props.product.price,
      quantity: quantity.value,
    };
  
    router.push({
      name: "BuyerPayReadyView",
      query: {
        products: JSON.stringify([selectedProduct]),
        totalPrice: totalPriceValue,
      },
    });
  };
  </script>
  
  <style scoped>
  .product-info {
    text-align: center;
  }
  .product-name {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .product-company {
    color: #666;
    margin-bottom: 10px;
  }
  .product-price {
    font-size: 20px;
    font-weight: bold;
    color: #4caf50;
  }
  .quantity-selector {
    text-align: center;
  }
  .quantity-value {
    font-size: 18px;
    font-weight: bold;
  }
  .product-description {
    font-size: 16px;
    margin-bottom: 10px;
  }
  .category-title {
    font-weight: bold;
    margin-top: 20px;
  }
  .action-buttons {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background: white;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  }
  </style>
  