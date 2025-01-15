<template>
    <v-app>
      <!-- 내비게이션 바 -->
      <v-app-bar app>
        <v-toolbar-title>Pill요해?</v-toolbar-title> <!-- 내비게이션 제목 -->
        <v-spacer></v-spacer> <!-- 버튼들을 오른쪽으로 정렬 -->
        <v-btn text to="/buyer">홈</v-btn>
        <v-btn text to="#">설문</v-btn>
        <v-btn text to="/cart">장바구니</v-btn>
        <v-btn text to="#">마이페이지</v-btn>
        <v-btn text color="red" @click="logout">로그아웃</v-btn> <!-- 로그아웃 버튼 -->
      </v-app-bar>
  
      <!-- 장바구니 폼 -->
      <v-main>
        <!-- 장바구니 상품 목록, 총 금액 전달,  상품 수량/삭제 후 데이터를 새로 고침 -->
        <CartForm
          :products="cart.products" 
          :totalPrice="cart.totalPrice"
          @refresh="fetchCart"
        />
      </v-main>
    </v-app>
  </template>
  
  <script>
  import api from '../../api/axios'; // 서버와 통신을 위한 Axios 가져오기
  import CartForm from '../../components/buyer/CartForm.vue';
  
  export default {
    components: { CartForm },
    data() {
      return {
        cart: {
          products: [], // 장바구니 상품 목록
          totalPrice: 0, // 장바구니 총 금액
        },
      };
    },
    methods: {
      // 장바구니 데이터를 서버에서 가져오는 함수
      async fetchCart() {
        try {
          const response = await api.get('/carts'); // 서버에 GET 요청
          this.cart.products = response.data.products; // 상품 목록 저장
          this.cart.totalPrice = response.data.totalPrice; // 총 금액 저장
        } catch (error) {
          console.error('장바구니 불러오기 실패:', error.response?.data || error.message);
          alert('장바구니를 불러오지 못했습니다.');
        }
      },
      // 로그아웃 처리 함수
      async logout() {
            console.log("로그아웃 버튼 클릭됨"); // 버튼 클릭 여부 확인

            try {
                // 로그아웃 API 호출
                await api.post('/users/logout', {}, {
                    withCredentials: true, // 쿠키 전송 허용
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}` // 액세스 토큰 추가
                    }
                });

                // 성공적으로 로그아웃하면 로그인 페이지로 이동
                this.$router.push('/login');
                alert('로그아웃 되었습니다.');
            } catch (error) {
                console.error("로그아웃 중 에러:", error.response?.data || error.message);
                alert('로그아웃 실패: 서버 오류');
            }
        }
    },
    // 컴포넌트가 화면에 나타날 때 실행되는 함수
    mounted() {
      this.fetchCart(); // 화면이 나타날 때 장바구니 데이터 가져오기
    },
  };
  </script>
  
  <style>
  /* 필요한 스타일을 추가할 수 있습니다. */
  </style>
  