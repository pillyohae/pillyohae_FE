<template>
  <v-container>
    <!-- 결제 정보 화면 -->
    <h2 class="my-4">결제정보 입력</h2>

    <!-- 배송 정보 -->
    <v-card class="mb-4">
      <v-card-title>배송 정보</v-card-title>
      <v-card-text>
        <p>{{ deliveryInfo.name }} | {{ deliveryInfo.phoneNumber }}</p>
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

    <!-- 쿠폰 선택 -->
    <v-card class="mb-4">
      <v-card-title>쿠폰 적용</v-card-title>
      <v-card-text>
        <p>선택된 쿠폰: {{ selectedCoupon ? selectedCoupon.couponName : '없음' }}</p>
        <v-btn color="blue" text @click="openCouponDialog">쿠폰 선택</v-btn>
      </v-card-text>
    </v-card>

    <!-- 결제 금액 -->
    <v-card class="mb-4">
      <v-card-title>결제 금액</v-card-title>
      <v-card-text>
        <p>상품 금액: {{ formatPrice(totalPrice) }}원</p>
        <p>할인 금액: -{{ formatPrice(discountAmount) }}원</p>
        <p>최종 결제 금액: {{ formatPrice(totalPrice - discountAmount) }}원</p>
      </v-card-text>
    </v-card>

    <!-- 결제 버튼 -->
    <v-btn color="green" block @click="openPayment">결제하기</v-btn>


    <!-- 쿠폰 선택 다이얼로그 -->
    <v-dialog v-model="couponDialog" max-width="600px">
      <v-card>
        <v-card-title>사용 가능한 쿠폰</v-card-title>
        <v-card-text>
          <v-row v-for="coupon in coupons" :key="coupon.couponId" class="mb-2">
            <v-col>
              <strong>{{ coupon.couponName }}</strong>
              <p>{{ coupon.couponDescription }}</p>
              <p>
                할인:
                <span v-if="coupon.discountType === 'PERCENTAGE'">
                  {{ coupon.fixedRate }}% (최대 {{ formatPrice(coupon.maxDiscountAmount) }}원)
                </span>
                <span v-else-if="coupon.discountType === 'FIXED_AMOUNT'">
                  {{ formatPrice(coupon.fixedAmount) }}원
                </span>
              </p>
              <v-btn color="green" text @click="applyCoupon(coupon)">적용</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" text @click="closeCouponDialog">닫기</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script>
import api from '../../api/axios';

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
    deliveryInfo: {
      type: Object,
      required: true, // 반드시 부모 컴포넌트에서 전달받아야 함
    },
  },
  data() {
    return {
      couponDialog: false,
      coupons: [],
      selectedCoupon: null,
      discountAmount: 0,
      widets: null,
    };
  },
  methods: {
    formatPrice(value) {
      return value.toLocaleString();
    },
    editDelivery() {
      alert("배송 정보를 수정하는 기능은 추후 구현될 예정입니다.");
    },
    async openCouponDialog() {
      try {
        const response = await api.get(`/users/coupons?totalPrice=${this.totalPrice}`);
        this.coupons = response.data.couponList;
        this.couponDialog = true;
      } catch (error) {
        console.error('쿠폰 목록 가져오기 실패:', error.response?.data || error.message);
        alert('쿠폰 목록을 가져올 수 없습니다.');
      }
    },
    closeCouponDialog() {
      this.couponDialog = false;
    },
    applyCoupon(coupon) {
      this.selectedCoupon = coupon;
      this.discountAmount = this.calculateDiscount(coupon);
      this.couponDialog = false;
    },
    calculateDiscount(coupon) {
      if (coupon.discountType === 'FIXED_AMOUNT') {
        return coupon.fixedAmount;
      } else if (coupon.discountType === 'PERCENTAGE') {
        const discount = (this.totalPrice * coupon.fixedRate) / 100;
        return Math.min(discount, coupon.maxDiscountAmount);
      }
      return 0;
    },

    openPayment() {
      const queryParams = new URLSearchParams({
        orderId: `ORDER_${Date.now()}`,
        orderName: `영양제_${this.selectedProducts.length}_건`,
        totalAmount: this.totalPrice - this.discountAmount,
        customerName: this.deliveryInfo.name,
        customerEmail: this.deliveryInfo.email,
        customerMobilePhone: this.deliveryInfo.phoneNumber,
        clientKey: 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
        customerKey: 'vxkGzcNE9r_YudzBIOMfJas',
        successUrl: 'http://localhost:5173/success',
        failUrl: 'http://localhost:5173/fail',
      });

      window.open(`/payment?${queryParams.toString()}`, '_blank', 'width=600,height=700');
    }
  }
};
</script>