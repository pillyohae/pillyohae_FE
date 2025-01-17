<template>
    <v-app>
      <!-- 내비게이션 바 -->
      <v-app-bar app>
        <v-toolbar-title>Pill요해?</v-toolbar-title>
        <v-spacer></v-spacer>
        <!-- 네비게이션 메뉴 -->
        <v-btn text to="/buyer">홈</v-btn>
        <v-btn text to="#">설문</v-btn>
        <v-btn text to="/cart">장바구니</v-btn>
        <v-btn text to="#">마이페이지</v-btn>
        <!-- 로그아웃 버튼 -->
        <v-btn text color="red" @click="logout">로그아웃</v-btn>
      </v-app-bar>
  
      <!-- 상품 목록 -->
      <v-main>
        <!-- BuyerProductFormView 컴포넌트를 사용하여 상품 표시 
         Vue의 props를 통해 부모에서 자식으로 데이터를 전달하는 방식
         :products는 부모의 products 데이터를 자식 컴포넌트 ProductForm의 props로 전달-->
        <ProductForm :products="products" />
      </v-main>
    </v-app>
  </template>
  
  <script>
  import ProductForm from '../../components/buyer/BuyerProductForm.vue'; // 상품 표시 컴포넌트 가져오기
  import api from '../../api/axios'; // 서버와 통신을 위한 Axios 가져오기
  import { logout } from '../../utils/auth';
  
  export default {
    components: { ProductForm }, // ProductForm 등록
    data() {
      return {
        products: [], // 서버에서 받아온 상품 목록을 저장하는 데이터
      };
    },
    methods: {
      // 서버에서 상품 목록을 가져오는 함수
      async fetchProducts() {
        try {
          const response = await api.get('/products/search'); // 서버에 상품 요청
          this.products = response.data.content; // 상품 목록 저장
        } catch (error) {
          console.error('제품 목록을 가져오는 중 오류 발생:', error.response?.data || error.message);
          alert('제품 목록을 불러오지 못했습니다.');
        }
      },
      async logout() {
            await logout(this.$router);
        },
    },
    //vue 컴포넌트의 라이프사이클 훅 중 하나. 컴포넌트가 DOM 에 완전히 마운트(렌더링) 된 후 호출됨.
    //사용자가 View에 접근하면 컴포넌트 초기화,DOM 렌더링 진행 후 렌더링이 완료되자마자 mounted() 가 호출
    //그 후 상품 데이터를 가져오는 것이다. 
    mounted() {
      //완전 렌더링 된 후 서버에서 상품 데이터를 가져오는 메서드 호출
      //컴포넌트가 완전히 화면에 나타난 후 데이터를 가져오므로 매끄러운 흐름을 구성할 수 있음
      this.fetchProducts();
    },
  };
  </script>
  