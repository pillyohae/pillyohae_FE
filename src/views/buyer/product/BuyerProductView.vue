<template>
    <v-app>
      <!-- 
        공통 네비게이션 바 컴포넌트
        - 구매자 페이지 상단에 고정된 네비게이션 바
      -->
      <buyer-navigation-bar />
  
      <!-- 상품 상세 정보 Form -->
      <v-main>
        <!-- 
          상품 데이터가 존재하는 경우: BuyerProductForm 컴포넌트에 데이터를 전달하여 렌더링
          - :product="product": 서버에서 가져온 상품 데이터를 props로 전달
        -->
        <div v-if="product">
          <BuyerProductForm :product="product" />
        </div>
  
        <!-- 상품 데이터가 없는 경우: 로딩 중 상태 표시 -->
        <div v-else class="text-center my-5">
          <!-- 로딩 애니메이션 (Vuetify의 Circular Progress 컴포넌트) -->
          <v-progress-circular indeterminate color="green"></v-progress-circular>
          <p>상품 정보를 불러오는 중...</p>
        </div>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import BuyerNavigationBar from "../BuyerNavigationBar.vue"; // 구매자 네비게이션 바 컴포넌트
  import { ref, onMounted } from "vue"; // Vue Composition API
  import { useRoute } from "vue-router"; // 현재 라우트 정보를 가져오는 Vue Router 기능
  import api from "../../../api/axios"; // 서버와 통신을 위한 Axios
  import BuyerProductForm from "../../../components/buyer/product/BuyerProductForm.vue"; // 상품 상세 정보를 렌더링하는 컴포넌트
  
  // 현재 라우트 정보를 가져오기 위한 Vue Router 사용
  const route = useRoute();
  
  // 상품 상세 정보를 저장하는 반응형 상태
  const product = ref(null); // 초기값은 null로 설정
  
  // 상품 상세 정보 요청 함수
  const fetchProductDetails = async () => {
    try {
      // URL의 productId 파라미터를 가져옴
      const productId = route.params.productId;
  
      // GET 요청으로 상품 상세 정보 가져오기
      const response = await api.get(`/products/${productId}`);
  
      // 서버에서 받은 상품 데이터를 반응형 상태에 저장
      product.value = response.data;
    } catch (error) {
      // 에러 발생 시 콘솔에 출력 및 사용자에게 알림 표시
      console.error("상품 상세 정보 요청 실패:", error.response?.data || error.message);
      alert("상품 정보를 불러오지 못했습니다.");
    }
  };
  
  // 컴포넌트가 화면에 렌더링되면 fetchProductDetails 함수 호출
  onMounted(fetchProductDetails);
  </script>
  