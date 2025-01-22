<template>
    <v-app>
        <v-app-bar app>
            <v-toolbar-title>Pill요해?</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- 네비게이션 메뉴 -->
            <v-btn text to="/buyer">홈</v-btn>
            <v-btn text to="/survey">설문</v-btn>
            <v-btn text to="/cart">장바구니</v-btn>
            <v-btn text to="/mypage">마이페이지</v-btn>
            <!-- 로그아웃 버튼 -->
            <v-btn text color="red" @click="performLogout">로그아웃</v-btn>
        </v-app-bar>

        <v-main>
            <my-page-form :userInfo="userInfo" :coupons="coupons"/>
        </v-main>
    </v-app>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import MyPageForm from '../../../components/buyer/mypage/MyPageForm.vue';
import api from '../../../api/axios';
import { logout } from '../../../utils/auth';

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

const performLogout = async () => {
    await logout();
}

</script>