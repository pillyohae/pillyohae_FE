<template>
  <v-container>
    <h2 class="my-4">장바구니</h2>

    <!-- 전체 선택/해제 -->
    <v-btn color="primary" class="mb-4" @click="toggleSelectAll" :outlined="!isAllSelected">
      {{ isAllSelected ? '전체 선택 해제' : '전체 선택' }}
    </v-btn>

    <!-- 장바구니 상품 목록 -->
    <v-row v-for="product in products" :key="product.cartId" class="mb-4">
      <v-col cols="12">
        <v-card>
          <v-row align-items="center" class="py-4">
            <!-- 개별 선택 -->
            <v-col cols="1">
              <v-checkbox v-model="selectedProducts" :value="product" />
            </v-col>

            <!-- 상품 이미지 -->
            <v-col cols="2">
              <v-img :src="product.imageUrl" alt="상품 이미지" height="100" />
            </v-col>

            <!-- 상품 정보 -->
            <v-col cols="6">
              <h3>{{ product.productName }}</h3>
              <p>{{ product.price.toLocaleString() }}원</p>
            </v-col>

            <!-- 수량 조절 버튼 -->
            <v-col cols="2" class="d-flex align-center">
              <v-btn icon @click="decrementQuantity(product)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <span class="mx-2">{{ product.quantity }}</span>
              <v-btn icon @click="incrementQuantity(product)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>

            <!-- 삭제 버튼 -->
            <v-col cols="1" class="d-flex justify-end">
              <v-btn icon color="red" @click="deleteProduct(product.cartId)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 상품 추가하기 -->
    <v-btn color="green" block to="/buyer">+ 상품 추가하기</v-btn>

    <!-- 선택된 상품 총 금액 -->
    <h3 class="mt-4">총 금액: {{ calculatedTotalPrice.toLocaleString() }}원</h3>

    <!-- 결제 버튼 -->
    <v-btn color="green" block large @click="proceedToOrder">
      주문하기 ({{ selectedProducts.length }}개)
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import api from '../../api/axios';
import { defineProps, defineEmits } from 'vue';
import { watch } from 'vue';

// Props 정의
const props = defineProps({
  products: {
    type: Array,
    required: true,
  },

  totalPrice: {
    type: Number,
    required: true,
  },
});

// props 값 확인을 위한 watch 추가
watch(() => props.products, (newValue) => {
  console.log('products props 변경:', newValue);
}, { immediate: true });

// 선택된 상품 목록
const selectedProducts = ref([]);

// 총 금액 계산 (선택된 상품만)
const calculatedTotalPrice = computed(() => {
  return selectedProducts.value.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
});

// 모든 상품이 선택되었는지 여부
const isAllSelected = computed(() => {
  return selectedProducts.value.length === props.products.length;
});

// 수량 증가 함수
const incrementQuantity = (product) => {
  const newQuantity = product.quantity + 1;
  updateQuantity(product.cartId, newQuantity);
  updateSelectedProduct(product.cartId, newQuantity);
};

// 수량 감소 함수 (최소 1 이상으로 제한)
const decrementQuantity = (product) => {
  if (product.quantity > 1) {
    const newQuantity = product.quantity - 1;
    updateQuantity(product.cartId, newQuantity);
    updateSelectedProduct(product.cartId, newQuantity);
  }
};

// 서버에 수량 업데이트 요청
const updateQuantity = async (cartId, quantity) => {
  try {
    await api.put(`/carts/${cartId}`, { quantity });
    emit('refresh'); // 부모 컴포넌트에 새로고침 요청 이벤트 전송
  } catch (error) {
    console.error('수량 업데이트 실패:', error.response?.data || error.message);
    alert('수량 변경에 실패했습니다.');
  }
};

// 상품 삭제 요청
const deleteProduct = async (cartId) => {
  try {
    await api.delete(`/carts/${cartId}`);
    emit('refresh'); // 부모 컴포넌트에 새로고침 요청 이벤트 전송
  } catch (error) {
    console.error('상품 삭제 실패:', error.response?.data || error.message);
    alert('상품 삭제에 실패했습니다.');
  }
};

// 전체 선택/해제 토글
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    // 전체 선택 해제
    selectedProducts.value = [];
  } else {
    // 전체 선택
    selectedProducts.value = [...props.products];
  }
};

// 선택된 상품 데이터를 부모 컴포넌트로 전달하여 주문 진행
const proceedToOrder = () => {
  if (selectedProducts.value.length === 0) {
    alert('주문할 상품을 선택해주세요.');
    return;
  }

  emit('proceedToOrder', {
    selectedProducts: selectedProducts.value,
    totalPrice: calculatedTotalPrice.value,
  });
};

// 선택된 상품의 수량 업데이트
const updateSelectedProduct = (cartId, quantity) => {
  const product = selectedProducts.value.find((item) => item.cartId === cartId);
  if (product) {
    product.quantity = quantity;
  }
};

// 부모 컴포넌트로 이벤트 전송
const emit = defineEmits(['refresh', 'proceedToOrder']);
</script>


<style></style>