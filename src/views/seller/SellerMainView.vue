<template>
    <v-app>
        <!-- 내비게이션 바 -->
        <v-app-bar app>
            <v-toolbar-title>Pill요해?</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- 네비게이션 메뉴 -->
            <v-btn text to="/seller">홈</v-btn>
            <v-btn text to="/seller/product">내 상품 보기</v-btn>
            <v-btn text to="#">요청 주문</v-btn>
            <!-- 로그아웃 버튼 -->
            <v-btn text color="red" @click="logout">로그아웃</v-btn>
        </v-app-bar>


        <v-main>
            <seller-product-form :products="products"></seller-product-form>
        </v-main>
    </v-app>
</template>

<script>

import SellerProductForm from '../../components/seller/SellerProductForm.vue'
import api from '../../api/axios'

export default {
    components: { SellerProductForm },

    data() {
        return {
            products: [],
        };
    },
    methods: {
        async fetchProducts() {
            try {
                const response = await api.get('/products/search');
                this.products = response.data.content;
            } catch (error) {
                console.error('상품 목록 불러오기 실패 : ', error.response?.data || error.message);
                alert('상품 목록을 불러오지 못했습니다.');
            }
        },

        async logout() {
            console.log("로그아웃 버튼 클릭됨"); // 버튼 클릭 여부 확인

            try {
                // 로그아웃 API 호출
                await api.post('/users/logout', {}, {
                    withCredentials: true, // 쿠키 전송 허용
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}` // 액세스 토큰 추가
                    }
                });

                // 성공적으로 로그아웃하면 로그인 페이지로 이동
                this.$router.push('/login');
                alert('로그아웃 되었습니다.');
            } catch (error) {
                console.error("로그아웃 중 에러:", error.response?.data || error.message);
                alert('로그아웃 실패: 서버 오류');
            }
        }


    },
    mounted() {
        this.fetchProducts();
    },

}
</script>

<style></style>