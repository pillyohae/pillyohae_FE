<template>
    <v-container>
        <h1 class="text-h5 font-weight-bold mb-6">요청 주문 내역</h1>
        <v-row>
            <v-col v-for="order in orders" :key="order.orderProductId" cols="12" md="6">
                <v-card outlined class="mb-4">
                    <v-card-title>
                        <div>
                            주문번호: {{ order.orderProductId }}<br />
                            주문자: {{ order.shippingAddress.receiverName }}
                            ({{ order.shippingAddress.phoneNumber }})<br />
                            주문시간: {{ formatDate(order.paidAt) }}
                        </div>
                    </v-card-title>
                    <v-card-text>
                        <v-img :src="order.imageUrl" alt="상품 이미지" height="120" class="mb-4"></v-img>
                        상품명: {{ order.productName }}<br />
                        수량: {{ order.quantity }}개<br />
                        가격: {{ formatPrice(order.productPrice) }}원<br />
                        총 주문 금액: {{ formatPrice(order.productPrice * order.quantity) }}원<br />
                        <v-chip :color="statusColors[order.status]" outlined class="mt-2">
                            {{ statusLabels[order.status] }}
                        </v-chip>
                    </v-card-text>
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
        <!-- Pagination -->
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
const props = defineProps({
    orders: {
        type: Array,
        required: true,
    },
    currentPage: {
        type: Number,
        required: true,
    },
    totalPages: {
        type: Number,
        required: true,
    },
});

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

const allowedNextStatuses = (status) => {
    const transitions = {
        CHECK_ORDER: ["READY_FOR_SHIPMENT"],
        READY_FOR_SHIPMENT: ["SHIPPED"],
        SHIPPED: ["DELIVERED"],
        DELIVERED: [],
        RETURN_REQUESTED: ["RETURNED"],
    };
    return transitions[status] || [];
};

const formatDate = (date) => new Date(date).toLocaleString();
const formatPrice = (price) => `${price.toLocaleString()}원`;
</script>

<style scoped>
.v-card {
    transition: box-shadow 0.3s ease;
}

.v-card:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
