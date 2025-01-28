<template>
  <v-app>
    <!-- 
      공통 네비게이션 바 컴포넌트 
      - 구매자 페이지 상단에 고정된 네비게이션 바
    -->
    <buyer-navigation-bar />

    <!-- 장바구니 폼 -->
    <v-main>
      <!-- 
        CartForm: 장바구니 UI를 구성하는 컴포넌트
        - :products: 장바구니에 담긴 상품 목록 (cart.products 전달)
        - :totalPrice: 장바구니의 총 금액 (cart.totalPrice 전달)
        - @proceedToOrder: 결제 준비 페이지로 이동하는 이벤트 처리
        - @refresh: 장바구니 데이터를 다시 가져오는 이벤트 처리
      -->
      <CartForm
        :products="cart.products"
        :totalPrice="cart.totalPrice"
        @proceedToOrder="navigateToPayReady"
        @refresh="fetchCart"
      />
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, reactive } from 'vue'; // Vue Composition API
import router from "../../router"; // Vue Router 사용
import api from '../../api/axios'; // 서버와 통신하기 위한 Axios
import CartForm from '../../components/buyer/CartForm.vue'; // 장바구니 UI 컴포넌트
import BuyerNavigationBar from './BuyerNavigationBar.vue'; // 구매자 네비게이션 바 컴포넌트

// 장바구니 데이터를 저장하는 반응형 상태
const cart = reactive({
  products: [], // 장바구니에 담긴 상품 목록
  totalPrice: 0, // 장바구니의 총 금액
});

// 장바구니 데이터를 서버에서 가져오는 함수
const fetchCart = async () => {
  try {
    // 서버에서 장바구니 데이터를 가져옴
    const response = await api.get('/carts');
    console.log('API 응답:', response.data); // API 응답 데이터 로그 출력

    // 응답 데이터를 cart 상태에 저장
    cart.products = response.data.products; // 장바구니 상품 목록 설정
    cart.totalPrice = response.data.totalPrice; // 총 금액 설정
  } catch (error) {
    // 에러 처리: 실패 메시지를 콘솔에 출력
    console.error('장바구니 불러오기 실패:', error.response?.data || error.message);
  }
};

// 선택된 상품 데이터를 결제 준비 페이지로 전달하는 함수
const navigateToPayReady = ({ selectedProducts, totalPrice }) => {
  // Vue Router를 사용해 결제 준비 페이지로 이동
  router.push({
    name: 'BuyerPayReadyView', // 이동할 라우트 이름
    query: {
      products: JSON.stringify(selectedProducts), // 선택된 상품 목록을 문자열로 변환해 전달
      totalPrice: totalPrice, // 총 금액 전달
    },
  });
};

// 컴포넌트가 마운트될 때 장바구니 데이터를 서버에서 가져옴
onMounted(() => {
  fetchCart(); // fetchCart 함수 호출
});
</script>
