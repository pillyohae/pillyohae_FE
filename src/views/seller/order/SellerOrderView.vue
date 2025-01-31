<template>
    <v-app>
        <!-- 판매자 네비게이션 바 (공통 네비게이션) -->
        <seller-navigation-bar />

        <v-main>
            <!-- 주문 목록 관리 폼 컴포넌트 -->
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
import SellerNavigationBar from "../SellerNavigationBar.vue"; // 판매자용 네비게이션 바
import SellerOrderForm from "../../../components/seller/order/SellerOrderForm.vue"; // 주문 목록 컴포넌트
import { ref, computed, onMounted } from "vue";
import api from "../../../api/axios"; // API 요청을 위한 Axios 인스턴스

// 주문 목록을 저장하는 반응형 상태
const orders = ref([]); 

// 현재 페이지 번호를 저장하는 반응형 상태
const currentPage = ref(1);

// 한 페이지에 보여줄 주문 개수
const itemsPerPage = 4;

// 현재 페이지에 맞는 주문 목록을 계산하여 반환 (computed 사용)
const paginatedOrders = computed(() =>
    orders.value.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage)
);

// 총 페이지 수 계산 (computed 사용)
const totalPages = computed(() => Math.ceil(orders.value.length / itemsPerPage));

// 서버에서 주문 목록 가져오기
const fetchOrders = async () => {
    try {
        // API 요청을 통해 판매자의 주문 목록 가져오기
        const response = await api.get("/users/sellers/orders");

        // API 응답 데이터에서 주문 목록 저장
        orders.value = response.data.content;
    } catch (error) {
        console.error("주문 목록 가져오기 실패:", error.response?.data || error.message);
        alert("주문 데이터를 불러오지 못했습니다.");
    }
};

// 주문 상태 업데이트 함수
const updateOrderStatus = async (orderProductId, nextStatus) => {
    try {
        // API 요청: 주문 상태 업데이트 (PUT 요청)
        await api.put(`/orders/orderItems/${orderProductId}/status`, null, {
            params: { orderProductStatus: nextStatus },
        });

        alert("주문 상태가 변경되었습니다.");
        
        // 변경된 주문 상태를 반영하기 위해 주문 목록 다시 불러오기
        fetchOrders();
    } catch (error) {
        console.error("주문 상태 변경 실패:", error.response?.data || error.message);
        alert("주문 상태를 변경하지 못했습니다.");
    }
};

// 페이지 변경 핸들러
const handlePageChange = (page) => {
    currentPage.value = page;
};

// 컴포넌트가 마운트될 때 주문 목록 가져오기
onMounted(() => {
    fetchOrders();
});
</script>
