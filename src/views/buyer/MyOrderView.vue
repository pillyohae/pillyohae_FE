<template>
  <v-container>
    <!-- 상단 내비게이션 -->
    <v-row>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-card-title>주문/배송 내역</v-card-title>
    </v-row>

    <!-- Form 컴포넌트 -->
    <v-card class="my-4">
      <my-order-form
        :orders="orders"
        :totalPages="pagination.totalPages"
        :startAt="pagination.startAt"
        :endAt="pagination.endAt"
        @changePage="changePage"
        @changeDateRange="changeDateRange"
      />
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MyOrderForm from '../../components/buyer/MyOrderForm.vue';
import api from '../../api/axios';

const orders = ref([]);
const pagination = ref({
  page: 1,
  totalPages: 1,
  startAt: null,
  endAt: null,
});

// 주문 내역 가져오기
const fetchOrders = async () => {
  try {
    const { page, startAt, endAt } = pagination.value;
    console.log(pagination.value);
    const response = await api.get('/users/orders', {
      params: {
        startAt,
        endAt,
        pageNumber: page - 1,
        pageSize: 4,
      },
    });
    orders.value = response.data.content;
    pagination.value.totalPages = response.data.totalPages;
    console.log(response.data);
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
  pagination.value.startAt = startAt;
  pagination.value.endAt = endAt;
  pagination.value.page = 1;
  fetchOrders();
};

onMounted(() => {
  fetchOrders();
});
</script>
