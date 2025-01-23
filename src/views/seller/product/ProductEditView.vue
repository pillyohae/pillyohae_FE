<template>
    <v-container>
        <!-- 이전으로 돌아가기 버튼 -->
        <v-row justify="space-between" class="mb-4">
            <v-btn icon @click="goBack">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <h2 class="text-h5 font-weight-bold">상품 수정하기</h2>
            <v-btn text color="red" @click="cancelEdit">취소</v-btn>
        </v-row>

        <!-- 상품 수정 Form -->
        <product-edit-form :initialProduct="initialProduct" />
    </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import ProductEditForm from '../../../components/seller/product/ProductEditForm.vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 라우터에서 데이터를 받음
const initialProduct = ref(
    route.query.productData ? JSON.parse(route.query.productData) : null
);

if (!initialProduct.value) {
    alert('상품 정보가 없습니다. 다시 시도해주세요.');
    router.push(`/seller/product/${route.params.productId}`);
}

const goBack = () => {
    router.push(`/seller/product/${route.params.productId}`);
};

const cancelEdit = () => {
    router.push(`/seller/product/${route.params.productId}`);
};
</script>