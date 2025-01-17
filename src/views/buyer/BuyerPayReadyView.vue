<template>
    <v-app>
        <!-- 내비게이션 바 -->
        <v-app-bar app>
            <v-toolbar-title>Pill요해?</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text to="/buyer">홈</v-btn>
            <v-btn text to="#">마이페이지</v-btn>
            <v-btn text color="red" @click="logout">로그아웃</v-btn>
        </v-app-bar>

        <!-- 결제 정보 폼 -->
        <v-main>
            <BuyerPayReadyForm :selectedProducts="selectedProducts" :totalPrice="totalPrice" />
        </v-main>
    </v-app>
</template>

<script>

import BuyerPayReadyForm from '../../components/buyer/BuyerPayReadyForm.vue';


export default {
    components: { BuyerPayReadyForm },
    data() {
        return {
            selectedProducts: [],
            totalPrice: 0,
        };
    },
    mounted() {
        const query = this.$route.query;

        if (!query.products || !query.totalPrice) {
            alert("주문 데이터가 없습니다.");
            this.$router.push("/cart");
            return;
        }

        this.selectedProducts = JSON.parse(query.products);
        this.totalPrice = Number(query.totalPrice);
    },
    methods: {
        logout() {
            alert("로그아웃 되었습니다.");
            this.$router.push("/login");
        },
    },
};
</script>

<style scoped>
/* 스타일 필요 시 추가 */
</style>