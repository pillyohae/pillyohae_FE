<template>
    <v-container class="product-container">
        <v-row style="row-gap: 30px;">
            <!-- 서버에서 가져온 상품 목록을 반복해서 보여줌 -->
            <v-col v-for="product in products" :key="product.productId" cols="12" md="4">
                <v-card class="product-card">
                    <!-- 상품 이미지 -->
                    <v-img :src="product.thumbnailImage || 'https://placekitten.com/150/150'" alt="제품 이미지" height="200"
                        @click="goToProductDetail(product.productId)" class="product-image"></v-img>
                    <!-- 상품 이름, 회사, 카테고리, 가격 -->
                    <v-card-title class="product-title">{{ product.productName }}</v-card-title>
                    <v-card-subtitle class="product-subtitle">회사명: {{ product.companyName }}</v-card-subtitle>
                    <v-card-subtitle class="product-subtitle">카테고리: {{ product.category }}</v-card-subtitle>
                    <v-card-subtitle class="product-subtitle">가격: {{ product.price.toLocaleString()
                        }}원</v-card-subtitle>
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

<script setup>
import "../../assets/styles/main.css"
import { ref } from 'vue'; // 반응형 데이터 관리
import api from '../../api/axios'; // 서버와 통신을 위한 Axios 가져오기
import { useRouter } from 'vue-router';
// Props 정의
defineProps({
    products: {
        type: Array,
        required: true,
    },
});

// 반응형 상태 관리
const dialog = ref(false); // 다이얼로그 표시 여부
const selectedProduct = ref(null); // 선택된 상품 정보
const quantity = ref(1); // 선택된 상품 수량

const router = useRouter();

// 상품 상세 페이지로 이동하는 함수
const goToProductDetail = (productId) => {
    router.push({ name: 'BuyerProductView', params: { productId } });
};

// 장바구니 다이얼로그를 여는 함수
const openDialog = (product) => {
    selectedProduct.value = product; // 선택된 상품 설정
    quantity.value = 1; // 수량 초기화
    dialog.value = true; // 다이얼로그 열기
};

// 장바구니 다이얼로그를 닫는 함수
const closeDialog = () => {
    dialog.value = false;
};

// 수량을 1 증가시키는 함수
const incrementQuantity = () => {
    quantity.value++;
};

// 수량을 1 감소시키는 함수 (최소 1까지 제한)
const decrementQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

// 장바구니에 상품을 추가하는 함수
const addToCart = async () => {
    if (!selectedProduct.value) return; // 상품이 선택되지 않았으면 종료

    try {
        // 서버에 보낼 요청 데이터 생성
        const payload = {
            productId: selectedProduct.value.productId, // 선택된 상품의 ID
            quantity: quantity.value, // 선택된 수량
        };
        await api.post('/carts', payload); // 서버로 POST 요청 (장바구니 추가)
        alert('장바구니에 추가되었습니다.');
        closeDialog(); // 다이얼로그 닫기
    } catch (error) {
        console.error('장바구니 추가 실패:', error.response?.data || error.message);
        alert('장바구니 추가에 실패했습니다.');
    }
};
</script>

<style scoped>

</style>
