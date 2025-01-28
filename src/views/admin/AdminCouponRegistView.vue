<template>
    <!-- 전체 컨테이너 -->
    <v-container>
        <!-- 상단 헤더 영역 -->
        <!-- 뒤로가기 버튼과 헤더 제목 -->
        <v-row class="mb-4">
            <!-- 뒤로가기 버튼 -->
            <!-- @click: 버튼 클릭 시 goBack 함수 호출 -->
            <v-btn icon @click="goBack">
                <v-icon>mdi-arrow-left</v-icon> <!-- 뒤로가기 아이콘 -->
            </v-btn>

            <!-- 페이지 제목 -->
            <h2 class="text-h5 font-weight-bold ml-4">쿠폰 생성하기</h2>
        </v-row>

        <!-- 쿠폰 등록 Form -->
        <!-- AdminCouponRegistForm 컴포넌트 -->
        <!-- @submitCoupon: 쿠폰 데이터가 제출되면 submitCoupon 함수 호출 -->
        <admin-coupon-regist-form @submitCoupon="submitCoupon" />
    </v-container>
</template>

<script setup>
import AdminCouponRegistForm from '../../components/admin/AdminCouponRegistForm.vue'; // 쿠폰 등록 폼 컴포넌트
import { useRouter } from 'vue-router'; // 페이지 이동을 위한 Vue Router
import api from '../../api/axios'; // API 요청을 위한 Axios 모듈

// Vue Router 인스턴스 생성
const router = useRouter();

// 뒤로가기 함수
// - 쿠폰 생성 페이지에서 뒤로가기 버튼을 클릭하면 쿠폰 목록 페이지로 이동
const goBack = () => {
    router.push('/admin/coupon'); // '/admin/coupon' 경로로 이동
};

// 쿠폰 데이터를 서버에 제출하는 함수
// - couponData: 쿠폰 등록 폼에서 전달된 데이터
const submitCoupon = async (couponData) => {
    try {
        // POST 요청으로 쿠폰 데이터를 서버에 전송
        await api.post('/coupons', couponData);

        // 성공 메시지 출력
        alert('쿠폰이 성공적으로 등록되었습니다.');

        // 등록 완료 후 쿠폰 목록 페이지로 이동
        goBack();
    } catch (error) {
        // 에러 발생 시 콘솔에 출력
        console.error('쿠폰 등록 실패:', error.response?.data || error.message);

        // 실패 메시지 출력
        alert('쿠폰 등록에 실패했습니다.');
    }
};
</script>
