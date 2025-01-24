<template>
  <v-container>
    <!-- 상단 내비게이션 -->
    <v-row>
      <v-btn icon @click="$router.push('/mypage')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-card-title>주문/배송 내역</v-card-title>
    </v-row>

    <!-- Form 컴포넌트 -->
    <v-card class="my-4">
      <my-order-form
        :orders="orders"
        :totalPages="pagination.totalPages"
        :startAt="pagination.startAt.toISOString()"
        :endAt="pagination.endAt.toISOString()"
        :currentPage="pagination.page"
        @changePage="changePage"
        @changeDateRange="changeDateRange"
      />
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MyOrderForm from '../../../components/buyer/order/MyOrderForm.vue';
import api from '../../../api/axios';

const orders = ref([]);
const pagination = ref({
  page: 1,
  totalPages: 1,
  startAt: new Date(),
  endAt: new Date(),
});

const fetchOrders = async () => {
  try {
    const { page, startAt, endAt } = pagination.value;

    // 시작 날짜: 00:00:00
    const startAtFormatted = new Date(startAt);
    startAtFormatted.setHours(0, 0, 0, 0);

    // 종료 날짜: 23:59:59
    const endAtFormatted = new Date(endAt);
    endAtFormatted.setHours(23, 59, 59, 999);

    // LocalDateTime 형식으로 변환 (yyyy-MM-dd'T'HH:mm:ss)
    const toLocalDateTime = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

    const response = await api.get('/users/orders', {
      params: {
        startAt: toLocalDateTime(startAtFormatted), // yyyy-MM-dd'T'HH:mm:ss
        endAt: toLocalDateTime(endAtFormatted),
        pageNumber: page - 1,
        pageSize: 4,
      },
    });

    orders.value = response.data.content;
    pagination.value.totalPages = response.data.totalPages;
  } catch (error) {
    console.error('주문 내역 불러오기 실패:', error.response?.data || error.message);
  }
};



// 페이지 변경 이벤트 처리
const changePage = (page) => {
  pagination.value.page = page;
  fetchOrders();
};

// 날짜 범위 변경 이벤트 처리
const changeDateRange = ({ startAt, endAt }) => {
  pagination.value.startAt = new Date(startAt);
  pagination.value.endAt = new Date(endAt);
  pagination.value.page = 1;
  fetchOrders();
};

onMounted(() => {
  fetchOrders();
});
</script>
