<template>
    <v-container>
      <!-- 상단 내비게이션 -->
      <v-row align-center justify="space-between" class="mb-4">
        <v-btn icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card-title>주문 상세 보기</v-card-title>
      </v-row>
  
      <!-- 상세 폼 컴포넌트 -->
      <v-card class="my-4" v-if="orderInfo && orderProducts.length">
        <my-order-detail-form :orderInfo="orderInfo" :orderProducts="orderProducts" />
      </v-card>
  
      <!-- 로딩 상태 표시 -->
      <v-progress-circular v-else indeterminate color="primary" class="mx-auto my-12" />
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router'; // useRoute 임포트
  import MyOrderDetailForm from '../../components/buyer/MyOrderDetailForm.vue';
  import api from '../../api/axios';
  
  const route = useRoute(); // useRoute 사용
  const orderId = route.params.orderId; // 경로 파라미터에서 orderId 가져오기
  console.log(orderId);
  
  const orderInfo = ref(null);
  const orderProducts = ref([]);
  
  // 주문 상세 정보 가져오기
  const fetchOrderDetail = async () => {
    try {
      const response = await api.get(`/users/orders/${orderId}/orderItems`);
      orderInfo.value = response.data.orderInfo;
      orderProducts.value = response.data.orderProducts;
      console.log(orderInfo.value);
      console.log(orderProducts.value);
    } catch (error) {
      console.error('주문 상세 불러오기 실패:', error.response?.data || error.message);
    }
  };
  
  onMounted(() => {
    fetchOrderDetail();
  });
  </script>
  