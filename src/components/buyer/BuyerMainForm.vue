<!--BuyerMainForm.vue-->
<template>
    <v-container class="product-container">
      <v-row style="row-gap: 30px;">
        <!-- 서버에서 가져온 상품 목록을 반복해서 보여줌 -->
        <v-col
          v-for="product in products"
          :key="product.productId"
          cols="12"
          md="4"
        >
          <v-hover>
          <template #default="{ isHovering, props }">
            <div 
              v-bind="props"
              class="product-wrapper"
            >

             <!-- 말풍선: 마우스 오버 시, 그리고 상품에 personaMessages가 있을 경우 -->
             <PersonaSpeechBubble
                v-if="isHovering && product.personaMessages && product.personaMessages.length"
                :messages="product.personaMessages"
                :interval="3000"
                class="speech-bubble-container"
              />
              <v-card class="product-card">
            
                <!-- 상품 이미지 -->
                <v-img
                  :src="product.thumbnailImage || 'https://placekitten.com/150/150'"
                  alt="제품 이미지"
                  height="200"
                  @click="goToProductDetail(product.productId)"
                  class="product-image"
                ></v-img>
                <!-- 상품 정보 -->
                <v-card-title class="product-title">{{ product.productName }}</v-card-title>
                <v-card-subtitle class="product-subtitle">
                  회사명: {{ product.companyName }}
                </v-card-subtitle>
                <v-card-subtitle class="product-subtitle">
                  카테고리: {{ product.category }}
                </v-card-subtitle>
                <v-card-subtitle class="product-subtitle">
                  가격: {{ product.price.toLocaleString() }}원
                </v-card-subtitle>
                <!-- 장바구니 버튼 -->
                <v-card-actions>
                  <v-btn color="green" block @click="openDialog(product)">
                    장바구니
                  </v-btn>
                </v-card-actions>
              </v-card>
  
            </div>
        </template>
          </v-hover>
          
        </v-col>
      </v-row>
  
      <!-- 수량 선택 다이얼로그 (팝업 창) -->
      <v-dialog v-model="dialog" max-width="400px">
        <v-card>
          <v-card-title>수량 선택</v-card-title>
          <v-card-text>
            <div class="d-flex align-center justify-center">
              <v-btn icon @click="decrementQuantity">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <span class="mx-4">{{ quantity }}</span>
              <v-btn icon @click="incrementQuantity">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" text @click="closeDialog">취소</v-btn>
            <v-btn color="green" block @click="addToCart">장바구니에 추가</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script setup>
  import "../../assets/styles/main.css";
  import { ref } from 'vue';
  import api from '../../api/axios';
  import { useRouter } from 'vue-router';
  import PersonaSpeechBubble from "./PersonaSpeechBubble.vue";

  defineProps({
    products: {
      type: Array,
      required: true,
    },
  });
  
  const dialog = ref(false);
  const selectedProduct = ref(null);
  const quantity = ref(1);
  const router = useRouter();
  
  const goToProductDetail = (productId) => {
    router.push({ name: 'BuyerProductView', params: { productId } });
  };
  
  const openDialog = (product) => {
    selectedProduct.value = product;
    quantity.value = 1;
    dialog.value = true;
  };
  
  const closeDialog = () => {
    dialog.value = false;
  };
  
  const incrementQuantity = () => {
    quantity.value++;
  };
  
  const decrementQuantity = () => {
    if (quantity.value > 1) {
      quantity.value--;
    }
  };
  
  const addToCart = async () => {
    if (!selectedProduct.value) return;
    try {
      const payload = {
        productId: selectedProduct.value.productId,
        quantity: quantity.value,
      };
      await api.post('/carts', payload);
      alert('장바구니에 추가되었습니다.');
      closeDialog();
    } catch (error) {
      console.error('장바구니 추가 실패:', error.response?.data || error.message);
      alert('장바구니 추가에 실패했습니다.');
    }
  };
  </script>
  
  <style scoped>
  .product-wrapper {
    position: relative;
    min-height: 450px;
    margin: 10px;
    padding-top: 50px; /* 상단에 말풍선을 위한 공간 확보 */
  }
  
  .product-card {
    height: 100%;
    transition: all 0.3s;
    position: relative;
    z-index: 1;
  }
  
  /* PersonaSpeechBubble을 위한 스타일 */
  :deep(.speech-bubble-container) {
    position: absolute;
    top: -40px; /* 카드 위로 올리기 */
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    width: 100%;
  }
  </style>
  