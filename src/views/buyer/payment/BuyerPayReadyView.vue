<template>
    <v-app>
        <!-- 내비게이션 바 -->
        <v-app-bar app>
            <v-toolbar-title>Pill요해?</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text to="/buyer">홈</v-btn>
            <v-btn text to="/survey">설문</v-btn>
            <v-btn text to="/cart">장바구니</v-btn>
            <v-btn text to="/mypage">마이페이지</v-btn>
            <v-btn text color="red" @click="performLogout">로그아웃</v-btn>
        </v-app-bar>

        <!-- 결제 정보 폼 -->
        <v-main>
            <BuyerPayReadyForm :selectedProducts="selectedProducts" :totalPrice="totalPrice" :coupons="coupons"
                :deliveryInfo="deliveryInfo" @fetchCoupons="fetchCoupons" />
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import router from "../../../router";
import BuyerPayReadyForm from '../../../components/buyer/payment/BuyerPayReadyForm.vue';
import api from '../../../api/axios';
import { logout } from '../../../utils/auth';


// 반응형 상태 정의
const selectedProducts = ref([]); // 선택된 상품
const totalPrice = ref(0); // 총 금액
const coupons = ref([]); // 쿠폰 목록
const deliveryInfo = reactive({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
});

// 쿠폰 목록 가져오기
const fetchCoupons = async () => {
    try {
        const response = await api.get(`/users/coupons?totalPrice=${totalPrice}`);
        coupons.value = response.data.couponList;
    } catch (error) {
        console.error('쿠폰 목록 가져오기 실패:', error.response?.data || error.message);
        alert('쿠폰 목록을 가져올 수 없습니다.');
    }
};

// 로그아웃 처리
const performLogout = async () => {
    await logout();
};

// 컴포넌트가 마운트되면 실행되는 로직
onMounted(async () => {
    const query = router.currentRoute.value.query;

    // 주문 데이터 확인
    if (!query.products || !query.totalPrice) {
        alert('주문 데이터가 없습니다.');
        router.push('/cart');
        return;
    }

    // 쿼리에서 데이터 추출 및 상태 설정
    selectedProducts.value = JSON.parse(query.products);
    totalPrice.value = Number(query.totalPrice);

    try {
        // 사용자 프로필 정보 가져오기
        const response = await api.get('/users/profile');
        const profile = response.data;

        // 배송지 정보 설정
        if (profile?.address) {
            deliveryInfo.name = profile.name || '정보 없음';
            deliveryInfo.email = profile.email || '정보 없음';
            deliveryInfo.phoneNumber = profile.address.phoneNumber || '정보 없음';
            deliveryInfo.address = `${profile.address.postCode || ''} ${profile.address.roadAddress || ''} ${profile.address.detailAddress || ''}`.trim();
        } else {
            throw new Error('주소 정보가 누락되었습니다.');
        }
    } catch (error) {
        console.error('배송지 정보 불러오기 실패:', error.response?.data || error.message);
        alert('배송지 정보를 가져올 수 없습니다.');
    }
});
</script>
