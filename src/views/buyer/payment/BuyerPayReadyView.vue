<template>
    <v-app>
      <!-- 
        공통 네비게이션 바 컴포넌트
        - 구매자 페이지 상단에 고정된 네비게이션 바
      -->
      <buyer-navigation-bar />
  
      <!-- 결제 정보 폼 -->
      <v-main>
        <!-- 
          결제 준비 폼 컴포넌트
          - :selectedProducts: 선택된 상품 목록을 props로 전달
          - :totalPrice: 총 금액을 props로 전달
          - :coupons: 적용 가능한 쿠폰 목록을 props로 전달
          - :deliveryInfo: 배송 정보를 props로 전달
          - @fetchCoupons: 쿠폰 목록 갱신을 위한 이벤트 핸들러
        -->
        <BuyerPayReadyForm
          :selectedProducts="selectedProducts"
          :totalPrice="totalPrice"
          :coupons="coupons"
          :deliveryInfo="deliveryInfo"
          @fetchCoupons="fetchCoupons"
        />
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import BuyerNavigationBar from '../BuyerNavigationBar.vue'; // 공통 네비게이션 바 컴포넌트
  import { ref, onMounted, reactive } from 'vue'; // Vue Composition API
  import router from "../../../router"; // Vue Router
  import BuyerPayReadyForm from '../../../components/buyer/payment/BuyerPayReadyForm.vue'; // 결제 준비 폼 컴포넌트
  import api from '../../../api/axios'; // 서버와 통신을 위한 Axios 모듈
  
  // 선택된 상품 목록 (반응형 상태)
  const selectedProducts = ref([]); // 장바구니에서 선택된 상품 목록
  const totalPrice = ref(0); // 선택된 상품들의 총 금액
  const coupons = ref([]); // 사용 가능한 쿠폰 목록
  
  // 배송지 정보 (반응형 객체)
  const deliveryInfo = reactive({
    name: '', // 수령인 이름
    email: '', // 이메일 주소
    phoneNumber: '', // 연락처
    address: '', // 배송지 주소
  });
  
  // 쿠폰 목록 가져오기 함수
  // - 총 금액에 따라 적용 가능한 쿠폰 목록을 가져옴
  const fetchCoupons = async () => {
    try {
      // API 호출로 쿠폰 목록 가져오기
      const response = await api.get(`/users/coupons?totalPrice=${totalPrice}`);
      coupons.value = response.data.couponList; // 응답 데이터에서 쿠폰 목록 설정
    } catch (error) {
      // 에러 처리: 콘솔에 출력 및 사용자에게 알림 표시
      console.error('쿠폰 목록 가져오기 실패:', error.response?.data || error.message);
      alert('쿠폰 목록을 가져올 수 없습니다.');
    }
  };
  
  // 컴포넌트가 마운트될 때 실행되는 초기화 로직
  onMounted(async () => {
    const query = router.currentRoute.value.query; // 현재 라우트의 쿼리 파라미터 가져오기
  
    // 주문 데이터 확인
    if (!query.products || !query.totalPrice) {
      // 쿼리 데이터가 없으면 장바구니 페이지로 이동
      alert('주문 데이터가 없습니다.');
      router.push('/cart');
      return;
    }
  
    // 쿼리에서 데이터 추출 및 반응형 상태 설정
    selectedProducts.value = JSON.parse(query.products); // 선택된 상품 목록
    totalPrice.value = Number(query.totalPrice); // 총 금액
  
    try {
      // 사용자 프로필 정보 가져오기
      const response = await api.get('/users/profile');
      const profile = response.data;
  
      // 배송지 정보 설정
      if (profile?.address) {
        // 사용자 프로필에서 주소 정보가 있는 경우
        deliveryInfo.name = profile.name || '정보 없음'; // 사용자 이름
        deliveryInfo.email = profile.email || '정보 없음'; // 사용자 이메일
        deliveryInfo.phoneNumber = profile.address.phoneNumber || '정보 없음'; // 연락처
        deliveryInfo.address = `
          ${profile.address.postCode || ''} 
          ${profile.address.roadAddress || ''} 
          ${profile.address.detailAddress || ''}`.trim(); // 배송지 주소
      } else {
        // 주소 정보가 없는 경우 에러 처리
        throw new Error('주소 정보가 누락되었습니다.');
      }
    } catch (error) {
      // 에러 처리: 콘솔에 출력 및 사용자에게 알림 표시
      console.error('배송지 정보 불러오기 실패:', error.response?.data || error.message);
      alert('배송지 정보를 가져올 수 없습니다.');
    }
  });
  </script>
  