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


<script setup>
import { ref } from 'vue';
import api from '../../../api/axios';
import { defineProps } from 'vue';

// Props 정의
const props = defineProps({
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
    required: true,
  },
});

// 반응형 상태 선언
const couponDialog = ref(false); // 쿠폰 선택 다이얼로그 표시 여부
const coupons = ref([]); // 서버에서 가져온 쿠폰 목록
const selectedCoupon = ref(null); // 선택된 쿠폰
const discountAmount = ref(0); // 할인 금액

// 가격 포맷팅 함수
const formatPrice = (value) => value.toLocaleString();

// 배송 정보 수정 알림 함수
const editDelivery = () => {
  alert('배송 정보를 수정하는 기능은 추후 구현될 예정입니다.');
};

// 쿠폰 다이얼로그 열기
const openCouponDialog = async () => {
  try {
    const response = await api.get(`/users/coupons?totalPrice=${props.totalPrice}`);
    coupons.value = response.data.couponList; // 서버에서 가져온 쿠폰 목록 저장
    couponDialog.value = true; // 다이얼로그 표시
  } catch (error) {
    console.error('쿠폰 목록 가져오기 실패:', error.response?.data || error.message);
    alert('쿠폰 목록을 가져올 수 없습니다.');
  }
};

// 쿠폰 다이얼로그 닫기
const closeCouponDialog = () => {
  couponDialog.value = false;
};

// 쿠폰 적용
const applyCoupon = (coupon) => {
  selectedCoupon.value = coupon; // 선택된 쿠폰 저장
  discountAmount.value = calculateDiscount(coupon); // 할인 금액 계산
  couponDialog.value = false; // 다이얼로그 닫기
};

// 할인 금액 계산
const calculateDiscount = (coupon) => {
  if (coupon.discountType === 'FIXED_AMOUNT') {
    return coupon.fixedAmount; // 고정 금액 할인
  } else if (coupon.discountType === 'PERCENTAGE') {
    const discount = (props.totalPrice * coupon.fixedRate) / 100; // 퍼센트 할인
    return Math.min(discount, coupon.maxDiscountAmount); // 최대 할인 금액 제한
  }
  return 0; // 적용 가능한 할인 없음
};

// 결제 요청 처리
const openPayment = async () => {
  try {
    // 주문 생성 요청 데이터 구성
    const productInfos = props.selectedProducts.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    }));

    const couponIds = selectedCoupon.value ? [selectedCoupon.value.couponId] : [];

    const orderRequestData = {
      productInfos,
      couponIds,
    };

    // 서버에 주문 생성 요청
    const orderResponse = await api.post('/orders', orderRequestData);
    const orderId = orderResponse.data.orderInfo.orderId; // 생성된 주문 ID

    console.log('Order Response:', orderResponse.data);
    console.log('Order ID:', orderId);

    // 결제 페이지로 전달할 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      orderId, // 주문 ID
      orderName: `영양제_${props.selectedProducts.length}_건`, // 주문 이름
      totalAmount: props.totalPrice - discountAmount.value, // 최종 결제 금액
      customerName: props.deliveryInfo.name, // 고객 이름
      customerEmail: props.deliveryInfo.email, // 고객 이메일
      customerMobilePhone: props.deliveryInfo.phoneNumber, // 고객 전화번호
      clientKey: 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
      customerKey: 'vxkGzcNE9r_YudzBIOMfJas',
      successUrl: 'http://localhost:5173/success', // 결제 성공 URL
      failUrl: 'http://localhost:5173/fail', // 결제 실패 URL
    });

    // 결제 창 열기
    window.open(`/payment?${queryParams.toString()}`, '_blank', 'width=600,height=700');
  } catch (error) {
    console.error('주문 요청 실패:', error.response?.data || error.message);
    alert('주문에 실패했습니다.');
  }
};
</script>
