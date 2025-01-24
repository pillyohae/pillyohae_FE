<template>
    <v-app>
        <seller-navigation-bar />
        <v-main>
            <seller-order-form
                :orders="paginatedOrders"
                :current-page="currentPage"
                :total-pages="totalPages"
                @updateStatus="updateOrderStatus"
                @changePage="handlePageChange"
            />
        </v-main>
    </v-app>
</template>

<script setup>
import SellerNavigationBar from "../SellerNavigationBar.vue";
import SellerOrderForm from "../../../components/seller/order/SellerOrderForm.vue";
import { ref, computed, onMounted } from "vue";
import api from "../../../api/axios";

const orders = ref([]);
const currentPage = ref(1);
const itemsPerPage = 4;

const paginatedOrders = computed(() =>
    orders.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
);

const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage));

const fetchOrders = async () => {
    try {
        const response = await api.get("/users/sellers/orders");
        orders.value = response.data.content;
    } catch (error) {
        console.error("주문 목록 가져오기 실패:", error.response?.data || error.message);
        alert("주문 데이터를 불러오지 못했습니다.");
    }
};

const updateOrderStatus = async (orderProductId, nextStatus) => {
    try {
        await api.put(`/orders/orderItems/${orderProductId}/status`, null, {
            params: { orderProductStatus: nextStatus },
        });
        alert("주문 상태가 변경되었습니다.");
        fetchOrders();
    } catch (error) {
        console.error("주문 상태 변경 실패:", error.response?.data || error.message);
        alert("주문 상태를 변경하지 못했습니다.");
    }
};

const handlePageChange = (page) => {
    currentPage.value = page;
};

onMounted(() => {
    fetchOrders();
});
</script>
