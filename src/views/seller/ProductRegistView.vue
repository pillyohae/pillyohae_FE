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
};
</script>