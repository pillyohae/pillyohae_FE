<template>
    <v-app>
        <!-- 공통 네비게이션 바 컴포넌트 -->
    <buyer-navigation-bar />

        <v-main>
            <my-page-form :userInfo="userInfo" :coupons="coupons"/>
        </v-main>
    </v-app>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import MyPageForm from '../../../components/buyer/mypage/MyPageForm.vue';
import BuyerNavigationBar from '../BuyerNavigationBar.vue';
import api from '../../../api/axios';

const userInfo = reactive({
    name: '',
    email: '',
});

const coupons = ref([]);

onMounted(async () => {
    try {
        const userResponse = await api.get('/users/profile');
        userInfo.name = userResponse.data.name;
        userInfo.email = userResponse.data.email;

        const couponResponse = await api.get('/users/coupons');
        coupons.value.push(...couponResponse.data.couponList);

    } catch (error) {
        console.log('사용자 정보 조회 실패 : ', error.response?.data || error.response.message);
    }
})


</script>