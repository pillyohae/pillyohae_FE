<template>
  <v-container>
    <!-- 
      상단 내비게이션 바
      - 뒤로 가기 버튼
      - 페이지 제목 표시 (주문 상세 보기)
    -->
    <v-row align-center justify="space-between" class="mb-4">
      <!-- 뒤로 가기 버튼 -->
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-card-title>주문 상세 보기</v-card-title>
    </v-row>

    <!-- 
      주문 상세 정보 표시 (로딩 완료 시)
      - 주문 정보(`orderInfo`)와 주문 상품 목록(`orderProducts`)이 있을 경우 상세 폼 출력
    -->
    <v-card class="my-4" v-if="orderInfo && orderProducts.length">
      <my-order-detail-form :orderInfo="orderInfo" :orderProducts="orderProducts" />
    </v-card>

    <!-- 
      로딩 상태 표시 (데이터가 아직 로드되지 않았을 경우)
      - `v-progress-circular` 로딩 애니메이션 표시
    -->
    <v-progress-circular v-else indeterminate color="primary" class="mx-auto my-12" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // 현재 페이지의 라우트 정보를 가져오기 위한 useRoute
import MyOrderDetailForm from '../../../components/buyer/order/MyOrderDetailForm.vue'; // 주문 상세 정보 폼 컴포넌트
import api from '../../../api/axios'; // API 요청을 위한 axios 인스턴스

// 현재 라우트 정보를 가져옴
const route = useRoute(); 

// URL에서 orderId 가져오기 (주문 ID)
const orderId = route.params.orderId; 

console.log(orderId); // 콘솔에서 orderId 값 확인

// 반응형 상태 변수 (주문 정보 및 상품 목록 저장)
const orderInfo = ref(null); // 주문 정보
const orderProducts = ref([]); // 주문 상품 목록

// 주문 상세 정보 가져오는 함수
const fetchOrderDetail = async () => {
  try {
      // 서버로 GET 요청하여 주문 상세 정보 가져오기
      const response = await api.get(`/users/orders/${orderId}/orderItems`);

      // 응답 데이터에서 주문 정보 및 상품 목록 저장
      orderInfo.value = response.data.orderInfo;
      orderProducts.value = response.data.orderProducts;

      // 콘솔에 주문 정보 및 상품 목록 출력 (디버깅용)
      console.log(orderInfo.value);
      console.log(orderProducts.value);
  } catch (error) {
      // 에러 발생 시 콘솔 출력
      console.error('주문 상세 불러오기 실패:', error.response?.data || error.message);
  }
};

// 페이지가 로드될 때 주문 상세 정보 가져오기
onMounted(() => {
  fetchOrderDetail();
});
</script>
