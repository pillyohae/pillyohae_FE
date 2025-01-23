<template>
    <v-container>
        <!-- 상품 이미지 캐러셀 -->
        <v-row justify="center" class="mb-6">
            <v-carousel hide-delimiters>
                <v-carousel-item
                    v-for="(image, index) in product.imageUrls"
                    :key="index"
                    :src="image"
                ></v-carousel-item>
            </v-carousel>
        </v-row>

        <!-- 상품 정보 -->
        <v-row>
            <v-col cols="12" md="6">
                <h2 class="font-weight-bold">{{ product.productName }}</h2>
                <h4 class="grey--text">{{ product.companyName }}</h4>
                <h3 class="font-weight-bold green--text">
                    {{ formatPrice(product.price) }}
                </h3>
            </v-col>
        </v-row>

        <!-- 수량 선택 -->
        <v-row align-center class="my-4">
            <v-btn icon @click="decrementQuantity">
                <v-icon>mdi-minus</v-icon>
            </v-btn>
            <span class="mx-4">{{ quantity }}</span>
            <v-btn icon @click="incrementQuantity">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-row>

        <!-- 버튼 영역 -->
        <v-row justify="space-between" class="fixed-bottom">
            <v-btn color="green" block @click="handlePurchase">구매하기</v-btn>
            <v-btn color="primary" block @click="addToCart">장바구니 담기</v-btn>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from "vue";
import api from "../../../api/axios";
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
});

const quantity = ref(1);

const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
    }).format(price);
};

const incrementQuantity = () => {
    quantity.value++;
};

const decrementQuantity = () => {
    if (quantity.value > 1) quantity.value--;
};

const addToCart = async () => {
    try {
        const payload = {
            productId: props.product.productId,
            quantity: quantity.value,
        };
        await api.post("/carts", payload);
        alert("장바구니에 추가되었습니다.");
    } catch (error) {
        console.error("장바구니 추가 실패:", error.response?.data || error.message);
        alert("장바구니 추가에 실패했습니다.");
    }
};

// 선택된 상품 데이터를 결제 페이지로 전달
const handlePurchase = () => {
    const totalPriceValue = quantity.value * props.product.price;

    const selectedProduct = {
        productId: props.product.productId,
        productName: props.product.productName,
        price: props.product.price,
        quantity: quantity.value,
    };

    router.push({
        name: 'BuyerPayReadyView',
        query: {
            products: JSON.stringify([selectedProduct]), // 상품 데이터 배열로 전달
            totalPrice: totalPriceValue, // 총 금액 전달
        },
    });
};
</script>

<style scoped>
.fixed-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background: white;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}
</style>
