<template>
    <v-container>
        <!-- 페이지 제목 -->
        <h1 class="text-h5 font-weight-bold mb-6">요청 주문 내역</h1>

        <!-- 주문 목록 -->
        <v-row>
            <v-col v-for="order in orders" :key="order.orderProductId" cols="12" md="6">
                <!-- 주문 카드 -->
                <v-card outlined class="mb-4">
                    <!-- 주문 정보 -->
                    <v-card-title>
                        <div>
                            주문번호: {{ order.orderProductId }}<br />
                            주문자: {{ order.shippingAddress.receiverName }}
                            ({{ order.shippingAddress.phoneNumber }})<br />
                            주문시간: {{ formatDate(order.paidAt) }}
                        </div>
                    </v-card-title>
                    <!-- 주문 상품 정보 -->
                    <v-card-text>
                        <!-- 상품 이미지 -->
                        <v-img :src="order.imageUrl" alt="상품 이미지" height="120" class="mb-4"></v-img>
                        <!-- 상품 상세 정보 -->
                        상품명: {{ order.productName }}<br />
                        수량: {{ order.quantity }}개<br />
                        가격: {{ formatPrice(order.productPrice) }}원<br />
                        총 주문 금액: {{ formatPrice(order.productPrice * order.quantity) }}원<br />
                        <!-- 주문 상태 표시 -->
                        <v-chip :color="statusColors[order.status]" outlined class="mt-2">
                            {{ statusLabels[order.status] }}
                        </v-chip>
                    </v-card-text>
                    <!-- 주문 상태 변경 버튼 -->
                    <v-card-actions>
                        <v-btn
                            v-for="nextStatus in allowedNextStatuses(order.status)"
                            :key="nextStatus"
                            block
                            :color="statusColors[nextStatus]"
                            @click="$emit('updateStatus', order.orderProductId, nextStatus)"
                        >
                            {{ statusLabels[nextStatus] }}
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- 페이지네이션 -->
        <v-row justify="center" class="mt-4">
            <v-pagination
                :model-value="currentPage"
                :length="totalPages"
                @update:model-value="$emit('changePage', $event)"
            ></v-pagination>
        </v-row>
    </v-container>
</template>

<script setup>
// 부모 컴포넌트에서 전달받은 props 정의
const props = defineProps({
    orders: {
        type: Array,
        required: true, // 주문 목록 (배열)
    },
    currentPage: {
        type: Number,
        required: true, // 현재 페이지 번호
    },
    totalPages: {
        type: Number,
        required: true, // 전체 페이지 수
    },
});

// 주문 상태에 대한 한글 라벨 매핑
const statusLabels = {
    CHECK_ORDER: '주문 접수 중',
    READY_FOR_SHIPMENT: '배송 준비 완료',
    SHIPPED: '배송 중',
    DELIVERED: '배송 완료',
    RETURN_REQUESTED: '반품 요청됨',
    RETURNED: '반품 완료',
    DELIVERY_FAILED: '배송 실패',
    CANCELLED: '취소됨',
};

// 주문 상태에 따른 버튼 색상 매핑
const statusColors = {
    CHECK_ORDER: 'green',
    READY_FOR_SHIPMENT: 'blue',
    SHIPPED: 'orange',
    DELIVERED: 'purple',
    RETURN_REQUESTED: 'red',
    RETURNED: 'grey',
    DELIVERY_FAILED: 'red',
    CANCELLED: 'grey',
};

// 주문 상태별 변경 가능 상태 정의
const allowedNextStatuses = (status) => {
    const transitions = {
        CHECK_ORDER: ["READY_FOR_SHIPMENT"], // 주문 접수 후 배송 준비로 변경 가능
        READY_FOR_SHIPMENT: ["SHIPPED"], // 배송 준비 완료 후 배송 중으로 변경 가능
        SHIPPED: ["DELIVERED"], // 배송 중 후 배송 완료로 변경 가능
        DELIVERED: [], // 배송 완료 후 변경 불가
        RETURN_REQUESTED: ["RETURNED"], // 반품 요청 후 반품 완료로 변경 가능
    };
    return transitions[status] || []; // 정의되지 않은 상태는 빈 배열 반환
};

// 날짜 포맷 변환 함수 (YYYY-MM-DD HH:MM:SS)
const formatDate = (date) => new Date(date).toLocaleString();

// 가격 포맷 변환 함수 (숫자를 "1,000원" 형식으로 변환)
const formatPrice = (price) => `${price.toLocaleString()}원`;
</script>

<style scoped>
/* 카드 호버 효과 */
.v-card {
    transition: box-shadow 0.3s ease;
}

.v-card:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
