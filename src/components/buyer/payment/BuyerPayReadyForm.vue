<template>
  <v-container>
    <!-- 결제 정보 입력 화면 -->
    <!-- 사용자는 배송 정보, 주문 상품, 쿠폰 적용, 최종 결제 금액을 확인하고 결제 가능 -->

    <!-- 배송 정보 섹션 -->
    <v-card outlined class="mb-4">
      <v-card-title>배송 정보</v-card-title>
      <v-card-text>
        <!-- 사용자 배송 정보 표시 -->
        <p>{{ deliveryInfo.name }} | {{ deliveryInfo.phoneNumber }}</p>
        <p>{{ deliveryInfo.address }}</p>
        <!-- 배송 정보 수정 버튼 -->
        <v-btn text @click="editDelivery">변경하기</v-btn>
      </v-card-text>
    </v-card>

    <!-- 주문한 영양제 목록 -->
    <v-card outlined class="mb-4">
      <v-card-title>구매 영양제 ({{ selectedProducts.length }})</v-card-title>
      <v-card-text>
        <!-- 사용자가 주문한 영양제 리스트를 반복 렌더링 -->
        <v-row v-for="product in selectedProducts" :key="product.cartId" class="mb-2">
          <!-- 상품 이름 및 수량 -->
          <v-col cols="8">{{ product.productName }} ({{ product.quantity }}개)</v-col>
          <!-- 상품 가격 -->
          <v-col cols="4" class="text-right">{{ formatPrice(product.price * product.quantity) }}원</v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- 쿠폰 적용 섹션 -->
    <v-card outlined class="mb-4">
      <v-card-title>쿠폰 적용</v-card-title>
      <v-card-text>
        <!-- 선택된 쿠폰 정보 표시 -->
        <p>선택된 쿠폰: {{ selectedCoupon ? selectedCoupon.couponName : '없음' }}</p>
        <!-- 쿠폰 선택 버튼 -->
        <v-btn color="blue" text @click="openCouponDialog">쿠폰 선택</v-btn>
      </v-card-text>
    </v-card>

    <!-- 결제 금액 요약 -->
    <v-card outlined class="mb-4">
      <v-card-title>결제 금액</v-card-title>
      <v-card-text>
        <!-- 총 상품 금액 -->
        <p>상품 금액: {{ formatPrice(totalPrice) }}원</p>
        <!-- 적용된 할인 금액 -->
        <p>할인 금액: -{{ formatPrice(discountAmount) }}원</p>
        <!-- 최종 결제 금액 -->
        <p>최종 결제 금액: {{ formatPrice(totalPrice - discountAmount) }}원</p>
      </v-card-text>
    </v-card>

    <!-- 결제 버튼 -->
    <!-- 사용자가 선택한 상품을 결제하는 버튼 -->
    <v-btn color="green" block @click="openPayment">결제하기</v-btn>

    <!-- 쿠폰 선택 다이얼로그 -->
    <v-dialog v-model="couponDialog" max-width="600px">
      <v-card>
        <v-card-title>사용 가능한 쿠폰</v-card-title>
        <v-card-text>
          <v-row>
            <!-- 사용 가능한 쿠폰을 반복 렌더링 -->
            <v-col v-for="coupon in coupons" :key="coupon.couponId" cols="12" class="mb-4">
              <v-card outlined>
                <!-- 쿠폰 이름 -->
                <v-card-title>{{ coupon.couponName }}</v-card-title>
                <!-- 쿠폰 설명 -->
                <v-card-subtitle class="grey--text text--darken-1">
                  {{ coupon.couponDescription }}
                </v-card-subtitle>
                <v-card-text>
                  <!-- 할인율 또는 할인 금액 정보 -->
                  할인:
                  <span v-if="coupon.discountType === 'PERCENTAGE'">
                    {{ coupon.fixedRate }}% (최대 {{ formatPrice(coupon.maxDiscountAmount) }}원)
                  </span>
                  <span v-else-if="coupon.discountType === 'FIXED_AMOUNT'">
                    {{ formatPrice(coupon.fixedAmount) }}원
                  </span>
                </v-card-text>
                <v-card-actions>
                  <!-- 쿠폰 적용 버튼 -->
                  <v-btn color="green" block @click="applyCoupon(coupon)">적용</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <!-- 쿠폰 다이얼로그 닫기 버튼 -->
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
// 부모 컴포넌트에서 전달받은 데이터를 관리
const props = defineProps({
  selectedProducts: {
    type: Array, // 주문한 상품 목록
    required: true,
  },
  totalPrice: {
    type: Number, // 총 상품 금액
    required: true,
  },
  deliveryInfo: {
    type: Object, // 배송 정보
    required: true,
  },
});

// 반응형 상태 선언
const couponDialog = ref(false); // 쿠폰 선택 다이얼로그 상태
const coupons = ref([]); // 서버에서 받아온 쿠폰 목록
const selectedCoupon = ref(null); // 현재 선택된 쿠폰
const discountAmount = ref(0); // 할인 금액 저장

// 가격 포맷팅 함수 (숫자를 "1,000원" 형식으로 변환)
const formatPrice = (value) => value.toLocaleString();

// 배송 정보 수정 알림 함수
const editDelivery = () => {
  alert('배송 정보를 수정하는 기능은 추후 구현될 예정입니다.');
};

// 쿠폰 선택 다이얼로그 열기
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

// 선택한 쿠폰 적용
const applyCoupon = (coupon) => {
  selectedCoupon.value = coupon; // 선택된 쿠폰 저장
  discountAmount.value = calculateDiscount(coupon); // 할인 금액 계산
  couponDialog.value = false; // 다이얼로그 닫기
};

// 할인 금액 계산 함수
const calculateDiscount = (coupon) => {
  if (coupon.discountType === 'FIXED_AMOUNT') {
    return coupon.fixedAmount; // 정액 할인 금액 반환
  } else if (coupon.discountType === 'PERCENTAGE') {
    const discount = (props.totalPrice * coupon.fixedRate) / 100; // 비율 할인 계산
    return Math.min(discount, coupon.maxDiscountAmount); // 최대 할인 금액 제한
  }
  return 0; // 할인 없음
};

// 결제 요청 처리
const openPayment = async () => {
  try {
    // 주문 데이터 구성
    const productInfos = props.selectedProducts.map((product) => ({
      productId: product.productId,
      quantity: product.quantity,
    }));

    const couponIds = selectedCoupon.value ? [selectedCoupon.value.couponId] : [];

    const orderRequestData = {
      productInfos, // 주문할 상품 목록
      couponIds, // 적용된 쿠폰 목록
    };

    // 서버에 주문 생성 요청
    const orderResponse = await api.post('/orders', orderRequestData);
    const orderId = orderResponse.data.orderInfo.orderId; // 생성된 주문 ID

    console.log('Order Response:', orderResponse.data);
    console.log('Order ID:', orderId);

    // 결제 페이지로 전달할 쿼리 파라미터 구성
    const queryParams = new URLSearchParams({
      orderId, // 주문 ID
      orderName: orderResponse.data.orderInfo.orderName, // 주문 이름
      totalAmount: props.totalPrice - discountAmount.value, // 최종 결제 금액
      customerName: props.deliveryInfo.name, // 고객 이름
      customerEmail: props.deliveryInfo.email, // 고객 이메일
      customerMobilePhone: props.deliveryInfo.phoneNumber, // 고객 전화번호
      clientKey: 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm',
      customerKey: 'vxkGzcNE9r_YudzBIOMfJas',
      successUrl: `${import.meta.env.VITE_BASE_URL}/success`, // 환경 변수 사용
      failUrl: `${import.meta.env.VITE_BASE_URL}/fail`        // 환경 변수 사용
    });

    // 결제 창 열기
    window.open(`/payment?${queryParams.toString()}`, '_blank', 'width=600,height=700');
  } catch (error) {
    console.error('주문 요청 실패:', error.response?.data || error.message);
    alert('주문에 실패했습니다.');
  }
};
</script>
