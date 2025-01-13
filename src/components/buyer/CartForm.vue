<template>
    <v-container>
        <!-- 장바구니 화면-->
        <h2 class="my-4">장바구니</h2>

        <!-- 장바구니 상품 목록 -->
        <v-row v-for="product in products" :key="product.cartId" class="mb-4">
            <v-col cols="12">
                <v-card>
                    <v-row align-items="center" class="py-4">
                        <!--상품 이미지 default-->
                        <v-col cols="2">
                            <v-img :src="product.image_url || 'http://via.placeholder.com/150'" alt="상품 이미지"
                                height="100">
                            </v-img>
                        </v-col>

                        <!-- 상품 정보 -->
                        <v-col cols="6">
                            <h3>{{ product.productName }}</h3>
                            <p>{{ product.price.toLocaleString() }}원</p>
                        </v-col>

                        <!-- 수량 조절 버튼 -->
                        <v-col cols="2" class="d-flex align-center">
                            <v-btn icon @click="decrementQuantity(product)"> <!-- - 버튼 -->
                                <v-icon>mdi-minus</v-icon>
                            </v-btn>
                            <span class="mx-2">{{ product.quantity }}</span> <!-- 현재 수량 -->
                            <v-btn icon @click="incrementQuantity(product)"> <!-- + 버튼 -->
                                <v-icon>mdi-plus</v-icon>
                            </v-btn>
                        </v-col>

                        <!-- 삭제 버튼 -->
                        <v-col cols="2" class="d-flex justify-end">
                            <v-btn icon color="red" @click="deleteProduct(product.cartId)">
                                <v-icon>mdi-close</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

        </v-row>

        <!-- 상품 추가하기 버튼 -->
        <v-btn color="green" block to="/buyer">+ 상품 추가하기</v-btn>

        <!-- 총 금액 표시 -->
        <h3 class="mt-4">총 금액: {{ totalPrice.toLocaleString() }}원</h3>

        <!-- 결제 버튼 -->
        <v-btn color="green" block large>주문하기 ({{ products.length }}개)</v-btn>
    </v-container>
</template>

<script>
import api from '../../api/axios'; // 서버와 통신을 위한 Axios 가져오기

export default {
    props: {
        products: {
            type: Array, // 부모 컴포넌트에서 전달받는 상품 목록
            required: true, // 반드시 있어야 함
        },
        totalPrice: {
            type: Number, // 부모 컴포넌트에서 전달받는 총 금액
            required: true,
        },
    },
    methods: {
        // 상품 수량을 늘리는 함수
        incrementQuantity(product) {
            const newQuantity = product.quantity + 1; // 수량 +1
            this.updateQuantity(product.cartId, newQuantity);
        },
        // 상품 수량을 줄이는 함수
        decrementQuantity(product) {
            if (product.quantity > 1) { // 수량이 1 이상일 때만 줄이기 가능
                const newQuantity = product.quantity - 1;
                this.updateQuantity(product.cartId, newQuantity);
            }
        },
        // 서버에 수량 변경 요청을 보내는 함수
        async updateQuantity(cartId, quantity) {
            try {
                await api.put(`/carts/${cartId}`, { quantity }); // 서버에 PUT 요청
                this.$emit('refresh'); // 부모 컴포넌트에 데이터를 새로 고치라고 알림
            } catch (error) {
                console.error('수량 업데이트 실패 : ', error.response?.data || error.message);
                alert('수량 변경에 실패했습니다.');
            }
        },
        // 상품을 삭제하는 함수
        async deleteProduct(cartId) {
            try {
                await api.delete(`carts/${cartId}`); // 서버에 DELETE 요청
                this.$emit('refresh'); // 부모 컴포넌트에 데이터를 새로 고치라고 알림
            } catch (error) {
                console.error('상품 삭제 실패:', error.response?.data || error.message);
                alert('상품 삭제에 실패했습니다.');
            }
        },
        // 상품 추가 페이지로 이동하는 함수
        goToProductPage() {
            this.$router.push('/product'); // '/product' 페이지로 이동
        },
    },
};
</script>

<style></style>