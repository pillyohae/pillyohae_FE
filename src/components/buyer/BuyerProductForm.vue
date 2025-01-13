<template>
    <v-container>
        <v-row>
            <!-- 서버에서 가져온 상품 목록을 반복해서 보여줌 -->
            <v-col v-for="product in products" :key="product.productId" cols="12" md="4">
                <v-card>
                    <!-- 상품 이미지 -->
                    <v-img :src="product.image || 'https://via.placeholder.com/150'" alt="제품 이미지" height="150">
                    </v-img>
                    <!-- 상품 이름, 회사, 카테고리, 가격 -->
                    <v-card-title>{{ product.productName }}</v-card-title>
                    <v-card-subtitle>회사명: {{ product.companyName }}</v-card-subtitle>
                    <v-card-subtitle>카테고리: {{ product.category }}</v-card-subtitle>
                    <v-card-subtitle>가격: {{ product.price.toLocaleString() }}원</v-card-subtitle>
                    <!-- 장바구니 버튼 -->
                    <v-card-actions>
                        <v-btn color="green" block @click="openDialog(product)">장바구니</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- 수량 선택 다이얼로그 (팝업 창) -->
        <v-dialog v-model="dialog" max-width="400px">
            <v-card>
                <v-card-title>수량 선택</v-card-title>
                <v-card-text>
                    <!-- 수량 증가/감소 버튼 -->
                    <div class="d-flex align-center justify-center">
                        <v-btn icon @click="decrementQuantity">
                            <v-icon>mdi-minus</v-icon>
                        </v-btn>
                        <!-- 선택된 수량 -->
                        <span class="mx-4">{{ quantity }}</span>
                        <v-btn icon @click="incrementQuantity">
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <!-- 취소 버튼 -->
                    <v-btn color="red" text @click="closeDialog">취소</v-btn>
                    <!-- 장바구니 추가 버튼 -->
                    <v-btn color="green" block @click="addToCart">장바구니에 추가</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import api from '../../api/axios'; // 서버와 통신을 위한 Axios 가져오기
export default {
    props: {
        products: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            dialog: false, //다이얼로그 (장바구니 추가 팝업 창) 표시 여부
            selectedProduct: null, //선택된 상품 정보
            quantity: 1, // 선택된 상품의 수량
        };
    },
    methods: {
        // 장바구니 다이얼로그를 여는 함수
        openDialog(product) {
            this.selectedProduct = product; // 선택된 상품 저장
            this.quantity = 1; // 수량 초기화
            this.dialog = true; // 다이얼로그 열기
        },
        // 장바구니 다이얼로그를 닫는 함수
        closeDialog() {
            this.dialog = false;
        },
        // 수량을 1 증가시키는 함수
        incrementQuantity() {
            this.quantity++;
        },
        // 수량을 1 감소시키는 함수 (최소 1까지 가능)
        decrementQuantity() {
            if (this.quantity > 1) {
                this.quantity--;
            }
        },
        // 장바구니에 상품을 추가하는 함수
        async addToCart() {
            if (!this.selectedProduct) return; // 상품이 선택되지 않았을 경우 종료

            try {
                //서버에 보낼 요청 데이터를 payload 로 생성 
                const payload = {
                    productId: this.selectedProduct.productId, // 선택된 상품의 ID
                    quantity: this.quantity, // 선택된 수량
                };
                await api.post('/carts', payload); // 서버로 POST 요청 (장바구니 추가)
                alert('장바구니에 추가되었습니다.');
                this.closeDialog(); // 다이얼로그 닫기
            } catch (error) {
                console.error('장바구니 추가 실패:', error.response?.data || error.message);
                alert('장바구니 추가에 실패했습니다.');
            }
        },
    },
};
</script>

<style></style>