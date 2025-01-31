<template>
  <v-container>
    <!-- 상단 내비게이션 -->
    <v-row>
      <!-- 뒤로 가기 버튼: 클릭 시 마이페이지('/mypage')로 이동 -->
      <v-btn icon @click="$router.push('/mypage')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <!-- 페이지 제목: "주문/배송 내역" -->
      <v-card-title>주문/배송 내역</v-card-title>
    </v-row>

    <!-- 주문 내역을 표시하는 Form 컴포넌트 -->
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
import api from '../../../api/axios';  // Axios를 이용한 API 요청 모듈

// 주문 목록 데이터를 저장하는 반응형 변수
const orders = ref([]);

// 페이지네이션 및 날짜 범위를 관리하는 반응형 객체
const pagination = ref({
  page: 1,  // 현재 페이지 번호 (기본값: 1)
  totalPages: 1,  // 전체 페이지 수 (초기값: 1)
  startAt: new Date(),  // 시작 날짜 (기본값: 오늘)
  endAt: new Date(),  // 종료 날짜 (기본값: 오늘)
});

// 주문 내역을 가져오는 함수 (API 요청)
const fetchOrders = async () => {
  try {
    const { page, startAt, endAt } = pagination.value;

    // 시작 날짜를 00:00:00으로 설정하여 하루의 첫 시간부터 조회
    const startAtFormatted = new Date(startAt);
    startAtFormatted.setHours(0, 0, 0, 0);

    // 종료 날짜를 23:59:59로 설정하여 하루의 마지막 시간까지 조회
    const endAtFormatted = new Date(endAt);
    endAtFormatted.setHours(23, 59, 59, 999);

    // 날짜를 LocalDateTime (yyyy-MM-dd'T'HH:mm:ss) 형식으로 변환하는 유틸리티 함수
    const toLocalDateTime = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;

    // 백엔드 API 호출 (주문 내역 조회)
    const response = await api.get('/users/orders', {
      params: {
        startAt: toLocalDateTime(startAtFormatted),  // yyyy-MM-dd'T'HH:mm:ss 형식으로 변환하여 전달
        endAt: toLocalDateTime(endAtFormatted),
        pageNumber: page - 1,  // 백엔드는 0부터 시작하는 페이지 인덱스를 사용하므로 1을 빼서 전달
        pageSize: 4,  // 한 페이지당 4개의 주문 내역을 가져옴
      },
    });

    // API 응답 데이터를 반응형 변수에 저장
    orders.value = response.data.content;  // 주문 목록 저장
    pagination.value.totalPages = response.data.totalPages;  // 전체 페이지 수 업데이트
  } catch (error) {
    console.error('주문 내역 불러오기 실패:', error.response?.data || error.message);
  }
};

// 페이지 변경 시 호출되는 함수
const changePage = (page) => {
  pagination.value.page = page;  // 새로운 페이지 번호 설정
  fetchOrders();  // 새 페이지의 주문 목록을 다시 불러옴
};

// 날짜 범위가 변경될 때 호출되는 함수
const changeDateRange = ({ startAt, endAt }) => {
  pagination.value.startAt = new Date(startAt);  // 새로운 시작 날짜 설정
  pagination.value.endAt = new Date(endAt);  // 새로운 종료 날짜 설정
  pagination.value.page = 1;  // 날짜 변경 시 1페이지부터 다시 조회
  fetchOrders();  // 새로운 날짜 범위에 대한 주문 목록을 불러옴
};

// 컴포넌트가 마운트되면 주문 내역을 불러옴
onMounted(() => {
  fetchOrders();
});
</script>
