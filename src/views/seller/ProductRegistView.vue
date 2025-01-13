<template>
    <v-app>
        <!-- 내비게이션 바 -->
        <v-app-bar app>
            <v-toolbar-title>Pill요해?</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text to="/seller">홈</v-btn>
            <v-btn text to="/seller/product" color="green">내 상품 보기</v-btn>
            <v-btn text to="#">요청 주문 내역</v-btn>
            <v-btn text to="#">마이페이지</v-btn>
            <v-btn text color="red" @click="logout">로그아웃</v-btn>
        </v-app-bar>

        <!-- 상품 등록 Form -->
        <v-main>
            <product-regist-form/>
        </v-main>
    </v-app>
</template>

<script>
import ProductRegistForm from '../../components/seller/ProductRegistForm.vue';

export default {
    components: { ProductRegistForm },
    methods: {
        logout() {
            localStorage.removeItem("accessToken");
            this.$router.push("/login");
            alert("로그아웃되었습니다.");
        },
    },
};
</script>