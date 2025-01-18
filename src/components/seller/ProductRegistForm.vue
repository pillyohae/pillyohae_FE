<template>
    <v-container>
        <h2 class="my-4">상품 등록하기</h2>

        <v-form ref="form" @submit.prevent="handleSubmit">
            <!-- 상품 이름 -->
            <v-text-field v-model="product.productName" label="영양제 이름 *" required />

            <!-- 회사 이름 -->
            <v-text-field v-model="product.companyName" label="영양제 회사 *" required />

            <!-- 상품 설명 -->
            <v-textarea v-model="product.description" label="영양제 설명 *" required></v-textarea>

            <!-- 카테고리 선택 -->
            <h3>카테고리 선택 *</h3>
            <v-btn v-for="category in categories" :key="category"
                :color="product.category === category ? 'green' : 'grey'" outlined class="mr-2 mb-12"
                @click="product.category = category">
                {{ category }}
            </v-btn>

            <!-- 이미지 업로드 -->
            <h3>이미지 업로드 *</h3>
            <input type="file" multiple accept="image/*" @change="handleImageSelection" />
            <v-row class="mb-12">
                <v-col v-for="(image, index) in imagePreviews" :key="index" cols="2" class="mt-2">
                    <v-img :src="image" alt="이미지 미리보기" height="80"></v-img>
                </v-col>
            </v-row>

            <!-- 가격 -->
            <v-row>
                <v-text-field v-model="product.price" label="가격 *" type="number" required />

                <!-- 재고 -->
                <v-text-field v-model="product.stock" label="재고 *" type="number" required />

            </v-row>
            <!-- 등록 버튼 -->
            <v-btn type="submit" color="green" block class="mt-4">
                등록하기
            </v-btn>
        </v-form>
    </v-container>
</template>


<script setup>
import api from "../../api/axios";
import router from "../../router";
import { reactive, ref } from "vue";


const product = reactive({
    productName: "",
    category: "",
    description: "",
    companyName: "",
    price: null,
}
)

const categories = ref([
    "멀티비타민",
    "관절/뼈",
    "눈 건강",
    "간 건강",
    "스트레스",
    "수면",
    "장 건강",
])

const images = ref([]);
const imagePreviews = ref([]);

const handleSubmit = async () => {
    try {
        const productResponse = await api.post('/products', product);
        const productId = productResponse.data.productId;

        for (const image of images) {
            const formData = new FormData();
            formData.append("image", image);

            await api.post(`/products/${productId}/images`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            });
        }

        alert('상품이 등록되었습니다!');
        router.push('/products');
    } catch (error) {
        console.error("상품 등록 실패:", error.response?.data || error.message);
        alert("상품 등록에 실패했습니다.");
    }
}
</script>


<style></style>