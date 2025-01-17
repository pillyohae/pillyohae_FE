<template>
  <v-container>
    <!-- 결제 정보 화면 -->
    <h2 class="my-4">결제정보 입력</h2>

    <!-- 배송 정보 -->
    <v-card class="mb-4">
      <v-card-title>배송 정보</v-card-title>
      <v-card-text>
        <p>{{ deliveryInfo.name }} | {{ deliveryInfo.phone }}</p>
        <p>{{ deliveryInfo.address }}</p>
        <v-btn text @click="editDelivery">변경하기</v-btn>
      </v-card-text>
    </v-card>

    <!-- 주문 상품 목록 -->
    <v-card class="mb-4">
      <v-card-title>구매 영양제 ({{ selectedProducts.length }})</v-card-title>
      <v-card-text>
        <v-row v-for="product in selectedProducts" :key="product.cartId" class="mb-2">
          <v-col cols="8">{{ product.productName }} ({{ product.quantity }}개)</v-col>
          <v-col cols="4" class="text-right">{{ formatPrice(product.price * product.quantity) }}원</v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 결제 금액 -->
    <v-card class="mb-4">
      <v-card-title>결제 금액</v-card-title>
      <v-card-text>
        <p>상품 금액: {{ formatPrice(totalPrice) }}원</p>
        <p>배송비: 무료</p>
        <p>최종 결제 금액: {{ formatPrice(totalPrice) }}원</p>
      </v-card-text>
    </v-card>

    <!-- 결제 버튼 -->
    <v-btn color="green" block @click="confirmPayment">결제하기</v-btn>
  </v-container>
</template>

<script>
export default {
  props: {
    selectedProducts: {
      type: Array,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      deliveryInfo: {
        name: "홍길동",
        phone: "010-1234-5678",
        address: "서울특별시 강남구 테헤란로 123 (역삼동)",
      },
    };
  },
  methods: {
    formatPrice(value) {
      return value.toLocaleString(); // 가격 포맷
    },
    editDelivery() {
      alert("배송 정보를 수정하는 기능은 추후 구현될 예정입니다.");
    },
    confirmPayment() {
      alert("결제가 완료되었습니다.");
      // 결제 로직 추가
    },
  },
};
</script>

<style scoped>
/* 스타일 필요 시 추가 */
</style>
