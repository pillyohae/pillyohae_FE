<template>
  <v-app>
    <!-- 내비게이션 바 -->
    <v-app-bar app>
      <v-toolbar-title>Pill요해?</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/buyer">홈</v-btn>
      <v-btn text to="#">설문</v-btn>
      <v-btn text to="/cart">장바구니</v-btn>
      <v-btn text to="#">마이페이지</v-btn>
      <v-btn text color="red" @click="logout">로그아웃</v-btn>
    </v-app-bar>

    <!-- 장바구니 폼 -->
    <v-main>
      <CartForm :products="cart.products" :totalPrice="cart.totalPrice" @proceedToOrder="navigateToPayReady"
        @refresh="fetchCart" />
    </v-main>
  </v-app>
</template>

<script>
import api from '../../api/axios';
import CartForm from '../../components/buyer/CartForm.vue';
import { logout } from '../../utils/auth';

export default {
  components: { CartForm },
  data() {
    return {
      cart: {
        products: [],
        totalPrice: 0,
      },
    };
  },
  methods: {
    // 장바구니 데이터를 서버에서 가져오는 함수
    async fetchCart() {
      try {
        const response = await api.get('/carts');
        this.cart.products = response.data.products;
        this.cart.totalPrice = response.data.totalPrice;
      } catch (error) {
        console.error('장바구니 불러오기 실패:', error.response?.data || error.message);
      }
    },
    // 로그아웃 처리 함수
    async logout() {
      await logout(this.$router);
    },
    // 선택된 상품 데이터를 결제 페이지로 전달
    navigateToPayReady({ selectedProducts, totalPrice }) {
      this.$router.push({
        name: "BuyerPayReadyView",
        query: {
          products: JSON.stringify(selectedProducts),
          totalPrice: totalPrice,
        },
      });
    },

  },
  mounted() {
    this.fetchCart();
  },
};
</script>
