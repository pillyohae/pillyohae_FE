<template>


    <v-container>
        <v-row class="mb-4">
            <v-btn icon @click="goBack">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <h2 class="text-h5 font-weight-bold ml-4">쿠폰 생성하기</h2>
        </v-row>

        <!-- 쿠폰 등록 Form -->
        <admin-coupon-regist-form @submitCoupon="submitCoupon" />
    </v-container>

</template>

<script setup>
import AdminCouponRegistForm from '../../components/admin/AdminCouponRegistForm.vue';
import { useRouter } from 'vue-router';
import api from '../../api/axios';

const router = useRouter();

const goBack = () => {
    router.push('/admin/coupon');
};

const submitCoupon = async (couponData) => {
    try {
        await api.post('/coupons', couponData);
        alert('쿠폰이 성공적으로 등록되었습니다.');
        goBack();
    } catch (error) {
        console.error('쿠폰 등록 실패:', error.response?.data || error.message);
        alert('쿠폰 등록에 실패했습니다.');
    }
};
</script>