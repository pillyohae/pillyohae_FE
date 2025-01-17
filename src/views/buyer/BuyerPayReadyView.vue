<template>
    <v-app>
        <!-- 내비게이션 바 -->
        <v-app-bar app>
            <v-toolbar-title>Pill요해?</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text to="/buyer">홈</v-btn>
            <v-btn text to="#">설문</v-btn>
            <v-btn text to="/cart">장바구니</v-btn>
            <v-btn text to="#">마이페이지</v-btn>
            <v-btn text color="red" @click="logout">로그아웃</v-btn>
        </v-app-bar>

        <!-- 결제 정보 폼 -->
        <v-main>
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

<script>
import BuyerPayReadyForm from "../../components/buyer/BuyerPayReadyForm.vue";
import api from "../../api/axios";
import { logout } from "../../utils/auth";

export default {
    components: { BuyerPayReadyForm },
    data() {
        return {
            selectedProducts: [],
            totalPrice: 0,
            coupons: [],
            deliveryInfo: null, // 배송 정보를 저장
        };
    },
    async mounted() {
        const query = this.$route.query;

        if (!query.products || !query.totalPrice) {
            alert("주문 데이터가 없습니다.");
            this.$router.push("/cart");
            return;
        }

        this.selectedProducts = JSON.parse(query.products);
        this.totalPrice = Number(query.totalPrice);

        try {
            const response = await api.get("/users/profile");
            const profile = response.data;
            this.deliveryInfo = {
                name: profile.name,
                phoneNumber: profile.address.phoneNumber,
                address: `${profile.address.postCode} ${profile.address.roadAddress} ${profile.address.detailAddress}`,
            };
        } catch (error) {
            console.error("배송지 정보 불러오기 실패:", error.response?.data || error.message);
            alert("배송지 정보를 가져올 수 없습니다.");
        }
    },
    methods: {
        async fetchCoupons() {
            try {
                const response = await api.get(`/users/coupons?totalPrice=${this.totalPrice}`);
                this.coupons = response.data.couponList;
            } catch (error) {
                console.error("쿠폰 목록 가져오기 실패:", error.response?.data || error.message);
                alert("쿠폰 목록을 가져올 수 없습니다.");
            }
        },
        async logout() {
            await logout(this.$router);
        },
    },
};
</script>
