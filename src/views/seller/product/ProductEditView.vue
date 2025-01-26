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

        <!-- 로딩 메시지 -->
        <v-overlay v-if="isLoading" absolute>
            <v-progress-circular indeterminate size="64" color="green"></v-progress-circular>
            <p>페르소나 이미지를 재생성 중입니다. 잠시만 기다려주세요...</p>
        </v-overlay>

        <!-- 상품 수정 Form -->
        <product-edit-form
            @regeneratePersona="regeneratePersonaImage"
            @submitProduct="updateProduct"
            :initialProduct="initialProduct"
            :isLoading="isLoading"
        />
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import ProductEditForm from '../../../components/seller/product/ProductEditForm.vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../api/axios';

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);

const initialProduct = ref(
    route.query.productData ? JSON.parse(route.query.productData) : null
);

if (!initialProduct.value) {
    alert('상품 정보가 없습니다. 다시 시도해주세요.');
    router.push(`/seller/product/${route.params.productId}`);
}

// 이전 페이지로 돌아가기
const goBack = () => {
    router.push(`/seller/product/${route.params.productId}`);
};

// 수정 취소
const cancelEdit = () => {
    router.push(`/seller/product/${route.params.productId}`);
};

// 페르소나 이미지 재생성 핸들러
const regeneratePersonaImage = async (productId) => {
    isLoading.value = true;
    try {
        const response = await api.post(`/products/${productId}/ai-image`, {}, { timeout: 0 }); // 타임아웃 무한 설정
        alert('페르소나 이미지가 성공적으로 재생성되었습니다.');
        // 응답값에 포함된 이미지 URL을 업데이트
        const newPersonaImage = response.data.imageUrl;
        if (newPersonaImage) {
            initialProduct.value.images = initialProduct.value.images.map((img) =>
                img.position === 0 ? { ...img, imageUrl: newPersonaImage } : img
            );
        }
    } catch (error) {
        console.error('페르소나 이미지 재생성 실패:', error.response?.data || error.message);
        alert('페르소나 이미지 재생성에 실패했습니다.');
    } finally {
        isLoading.value = false;
    }
};

// 상품 수정 API 호출
const updateProduct = async (updatedProduct) => {
  try {
    await api.put(`/products/${updatedProduct.productId}`, updatedProduct);
    alert('상품 정보가 성공적으로 수정되었습니다.');
    router.push(`/seller/product/${updatedProduct.productId}`);
  } catch (error) {
    console.error('상품 수정 실패:', error.response?.data || error.message);
    alert('상품 정보 수정에 실패했습니다.');
  }
};
</script>

<style scoped>
/* 로딩 메시지 스타일 */
v-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.9);
}
</style>
