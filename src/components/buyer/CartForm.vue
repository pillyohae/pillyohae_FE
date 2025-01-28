<template>
  <v-container>
    <!-- 장바구니 제목 -->
    <h2 class="my-4">장바구니</h2>

    <!-- 전체 선택/해제 버튼 -->
    <!-- @click: toggleSelectAll 함수 호출 -->
    <!-- :outlined: 모든 상품이 선택된 상태가 아니면 버튼을 외곽선 스타일로 표시 -->
    <v-btn color="primary" class="mb-4" @click="toggleSelectAll" :outlined="!isAllSelected">
      {{ isAllSelected ? '전체 선택 해제' : '전체 선택' }}
    </v-btn>

    <!-- 장바구니 상품 목록 -->
    <!-- v-for: props.products 배열을 반복하여 각 상품을 렌더링 -->
    <v-row v-for="product in products" :key="product.cartId" class="mb-4">
      <v-col cols="12">
        <v-card>
          <v-row align-items="center" class="py-4">
            <!-- 개별 상품 선택 체크박스 -->
            <!-- v-model: selectedProducts 배열과 양방향 바인딩 -->
            <v-col cols="1">
              <v-checkbox v-model="selectedProducts" :value="product" />
            </v-col>

            <!-- 상품 이미지 -->
            <v-col cols="2">
              <v-img :src="product.imageUrl" alt="상품 이미지" height="100" />
            </v-col>

            <!-- 상품 정보 (이름, 가격) -->
            <v-col cols="6">
              <h3>{{ product.productName }}</h3>
              <p>{{ product.price.toLocaleString() }}원</p>
            </v-col>

            <!-- 수량 조절 버튼 -->
            <!-- 수량 감소 버튼 -->
            <!-- @click: decrementQuantity 함수 호출 -->
            <v-col cols="2" class="d-flex align-center">
              <v-btn icon @click="decrementQuantity(product)">
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <!-- 현재 상품 수량 -->
              <span class="mx-2">{{ product.quantity }}</span>
              <!-- 수량 증가 버튼 -->
              <!-- @click: incrementQuantity 함수 호출 -->
              <v-btn icon @click="incrementQuantity(product)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-col>

            <!-- 삭제 버튼 -->
            <!-- @click: deleteProduct 함수 호출 -->
            <v-col cols="1" class="d-flex justify-end">
              <v-btn icon color="red" @click="deleteProduct(product.cartId)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 상품 추가하기 버튼 -->
    <!-- to="/buyer": 상품 추가 페이지로 이동 -->
    <v-btn color="green" block to="/buyer">+ 상품 추가하기</v-btn>

    <!-- 선택된 상품 총 금액 -->
    <h3 class="mt-4">총 금액: {{ calculatedTotalPrice.toLocaleString() }}원</h3>

    <!-- 결제 버튼 -->
    <!-- @click: proceedToOrder 함수 호출 -->
    <v-btn color="green" block large @click="proceedToOrder">
      주문하기 ({{ selectedProducts.length }}개)
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import api from '../../api/axios'; // 서버와 통신을 위한 Axios
import { defineProps, defineEmits } from 'vue';

// Props 정의
const props = defineProps({
  // 장바구니 상품 목록
  products: {
    type: Array,
    required: true,
  },
  // 총 금액 (부모 컴포넌트에서 전달)
  totalPrice: {
    type: Number,
    required: true,
  },
});

// props 변경 감지
// - props.products가 변경될 때마다 콘솔에 출력
watch(
  () => props.products,
  (newValue) => {
    console.log('products props 변경:', newValue);
  },
  { immediate: true } // 즉시 실행
);

// 선택된 상품 목록
const selectedProducts = ref([]);

// 선택된 상품의 총 금액 계산
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
// - 상품의 수량을 1 증가시키고 서버에 업데이트 요청
const incrementQuantity = (product) => {
  const newQuantity = product.quantity + 1;
  updateQuantity(product.cartId, newQuantity); // 서버 업데이트
  updateSelectedProduct(product.cartId, newQuantity); // 선택된 상품 업데이트
};

// 수량 감소 함수
// - 최소 수량은 1로 제한
const decrementQuantity = (product) => {
  if (product.quantity > 1) {
    const newQuantity = product.quantity - 1;
    updateQuantity(product.cartId, newQuantity); // 서버 업데이트
    updateSelectedProduct(product.cartId, newQuantity); // 선택된 상품 업데이트
  }
};

// 서버에 수량 업데이트 요청
const updateQuantity = async (cartId, quantity) => {
  try {
    await api.put(`/carts/${cartId}`, { quantity }); // PUT 요청으로 수량 업데이트
    emit('refresh'); // 부모 컴포넌트에 새로고침 요청
  } catch (error) {
    console.error('수량 업데이트 실패:', error.response?.data || error.message);
    alert('수량 변경에 실패했습니다.');
  }
};

// 상품 삭제 요청
const deleteProduct = async (cartId) => {
  try {
    await api.delete(`/carts/${cartId}`); // DELETE 요청으로 상품 삭제
    emit('refresh'); // 부모 컴포넌트에 새로고침 요청
  } catch (error) {
    console.error('상품 삭제 실패:', error.response?.data || error.message);
    alert('상품 삭제에 실패했습니다.');
  }
};

// 전체 선택/해제 토글
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedProducts.value = []; // 전체 선택 해제
  } else {
    selectedProducts.value = [...props.products]; // 전체 선택
  }
};

// 선택된 상품을 부모 컴포넌트로 전달하여 주문 진행
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
    product.quantity = quantity; // 선택된 상품의 수량 업데이트
  }
};

// 부모 컴포넌트로 이벤트 전송 정의
const emit = defineEmits(['refresh', 'proceedToOrder']);
</script>
