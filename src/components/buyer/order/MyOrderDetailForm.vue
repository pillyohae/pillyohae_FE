<template>
    <v-container>
        <!-- 주문 정보 섹션 -->
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

        <!-- 주문 상품 섹션 -->
        <v-card outlined class="mb-4">
            <v-card-title>주문 상품</v-card-title>
            <v-card-text>
                <v-row v-for="product in orderProducts" :key="product.orderItemId" class="mb-4 align-center">
                    <v-col cols="2">
                        <v-img :src="product.imageUrl" alt="상품 이미지" height="80" contain></v-img>
                    </v-col>
                    <v-col cols="6">
                        <p><strong>{{ product.orderItemName }}</strong></p>
                        <p>{{ product.orderItemQuantity }}개 x {{ product.orderItemPrice.toLocaleString() }}원</p>
                    </v-col>
                    <v-col cols="4">
                        <v-progress-linear :model-value="progressValue(product.orderProductStatus)"
                            :bufferValue="progressValue(product.orderProductStatus)" stream rounded color="green"
                            height="10" striped>
                            <template v-slot:default="{ value }">
                                <strong>{{ Math.ceil(value) }}%</strong>
                            </template>
                        </v-progress-linear>
                        <p class="mt-2">{{ statusText(product.orderProductStatus) }}</p>
                    </v-col>
                </v-row>
                <p class="text-right font-weight-bold">총 결제 금액: {{ orderInfo.totalPrice.toLocaleString() }}원</p>
            </v-card-text>
        </v-card>

        <!-- 하단 버튼 -->
        <v-row class="justify-space-between">
            <v-btn outlined color="red" class="mr-4">주문 취소</v-btn>
            <v-btn outlined color="green">환불 요청</v-btn>
        </v-row>
    </v-container>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    orderInfo: {
        type: Object,
        required: true,
    },
    orderProducts: {
        type: Array,
        required: true,
    },
});

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

const progressValue = (status) => {
    switch (status) {
        case 'PENDING':
            return 25;
        case 'READY_FOR_SHIPMENT':
            return 50;
        case 'SHIPPED':
            return 75;
        case 'DELIVERED':
            return 100;
        default:
            return 0;
    }
};

const statusText = (status) => {
    switch (status) {
        case 'PENDING':
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
.font-weight-bold {
    font-weight: bold;
}
</style>