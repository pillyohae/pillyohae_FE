<template>
    <v-container>
        <!-- 
          주문 정보 섹션
          - 주문한 내용, 주문일, 주문 번호 표시
        -->
        <v-row>
            <v-col cols="12" md="6">
                <v-card outlined class="mb-4">
                    <v-card-title>주문 정보</v-card-title>
                    <v-card-text>
                        <p><strong>주문 내용:</strong> {{ orderInfo.orderName }}</p>
                        <p><strong>주문일:</strong> {{ formatDate(orderInfo.paidAt) }}</p>
                        <p><strong>주문 번호:</strong> {{ orderInfo.orderId }}</p>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- 
              배송 정보 섹션
              - 수령인, 연락처, 주소 정보 표시
            -->
            <v-col cols="12" md="6">
                <v-card outlined class="mb-4">
                    <v-card-title>배송 정보</v-card-title>
                    <v-card-text>
                        <p><strong>수령인:</strong> {{ orderInfo.shippingAddress.receiverName }}</p>
                        <p><strong>연락처:</strong> {{ orderInfo.shippingAddress.phoneNumber }}</p>
                        <p><strong>주소:</strong> {{ orderInfo.shippingAddress.roadAddress }} {{
                            orderInfo.shippingAddress.detailAddress }}</p>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- 
          주문 상품 섹션
          - 주문한 상품 목록을 표시
          - 진행 상태를 보여주는 프로그레스 바 포함
        -->
        <v-card outlined class="mb-4">
            <v-card-title>주문 상품</v-card-title>
            <v-card-text>
                <v-row v-for="product in orderProducts" :key="product.orderItemId" class="mb-4 align-center">
                    <!-- 상품 이미지 -->
                    <v-col cols="2">
                        <v-img :src="product.imageUrl" alt="상품 이미지" height="80" contain></v-img>
                    </v-col>

                    <!-- 상품 이름 및 수량, 가격 -->
                    <v-col cols="6">
                        <p><strong>{{ product.orderItemName }}</strong></p>
                        <p>{{ product.orderItemQuantity }}개 x {{ product.orderItemPrice.toLocaleString() }}원</p>
                    </v-col>

                    <!-- 주문 상태 진행률 표시 -->
                    <v-col cols="4">
                        <v-progress-linear 
                            :model-value="progressValue(product.orderProductStatus)"
                            :buffer-value="progressValue(product.orderProductStatus)" 
                            stream rounded color="green"
                            height="10" striped>
                            <template v-slot:default="{ value }">
                                <strong>{{ Math.ceil(value) }}%</strong>
                            </template>
                        </v-progress-linear>
                        <p class="mt-2">{{ statusText(product.orderProductStatus) }}</p>
                    </v-col>
                </v-row>
                <!-- 총 결제 금액 표시 -->
                <p class="text-right font-weight-bold">총 결제 금액: {{ orderInfo.totalPrice.toLocaleString() }}원</p>
            </v-card-text>
        </v-card>

        <!-- 
          하단 버튼 (주문 취소 및 환불 요청)
        -->
        <v-row class="justify-space-between">
            <v-btn outlined color="red" class="mr-4">주문 취소</v-btn>
            <v-btn outlined color="green">환불 요청</v-btn>
        </v-row>
    </v-container>
</template>

<script setup>
import { defineProps } from 'vue';

// 부모 컴포넌트에서 전달받는 주문 정보 및 상품 목록 props 정의
const props = defineProps({
    orderInfo: {
        type: Object, // 주문 정보 객체
        required: true, // 필수 값
    },
    orderProducts: {
        type: Array, // 주문 상품 목록 배열
        required: true, // 필수 값
    },
});

// 날짜 포맷 함수
// - ISO 형식의 날짜 문자열을 'YYYY-MM-DD HH:MM' 형식으로 변환
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// 주문 상태에 따른 진행률 계산 함수
const progressValue = (status) => {
    switch (status) {
        case 'CHECK_ORDER': // 주문 확인 중
            return 25;
        case 'READY_FOR_SHIPMENT': // 배송 준비 완료
            return 50;
        case 'SHIPPED': // 배송 중
            return 75;
        case 'DELIVERED': // 배송 완료
            return 100;
        default:
            return 0;
    }
};

// 주문 상태를 텍스트로 변환하는 함수
const statusText = (status) => {
    switch (status) {
        case 'CHECK_ORDER':
            return '주문 접수 중';
        case 'READY_FOR_SHIPMENT':
            return '배송 준비 완료';
        case 'SHIPPED':
            return '배송 중';
        case 'DELIVERED':
            return '배송 완료';
        default:
            return '상태 없음';
    }
};
</script>

<style>
/* 
  글자를 굵게 표시하는 스타일 
*/
.font-weight-bold {
    font-weight: bold;
}
</style>
