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

            <h3>메인 이미지 업로드 * (이 이미지는 페르소나 이미지 생성에 사용될 이미지입니다!)</h3>
            <input type="file" accept="image/*" @change="handleMainImageSelection"/>
            <v-row class="mb-12">
                <v-col cols="auto" v-if="mainImagePreview">
                    <v-img :src="mainImagePreview" alt="메인 이미지 미리보기" height="100" />
                    <v-btn small color="red" @click="removeMainImage(index)">삭제</v-btn>
                </v-col>
            </v-row>

            <!-- 이미지 업로드 -->
            <h3>상세 이미지 업로드 *</h3>
            <input type="file" multiple accept="image/*" @change="handleImageSelection" />
            <!-- 이미지 리스트 -->
            <draggable v-model="imagePreviews" :options="{ animation: 200 }" itemKey="index" @end="onImageOrderChanged"
                class="drag-container">
                <template #item="{ element, index }">
                    <div class="image-item">
                        <v-img :src="element" alt="이미지 미리보기" height="80" />
                        <v-btn small color="red" @click="removeImage(index)">삭제</v-btn>
                    </div>
                </template>
            </draggable>
            <br>
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
import api from "../../../api/axios";
import router from "../../../router";
import { reactive, ref } from "vue";
import draggable from "vuedraggable";

const product = reactive({
    productName: "",
    category: "",
    description: "",
    companyName: "",
    price: null,
    stock: null,
});

const categories = ref([
    "멀티비타민",
    "관절/뼈",
    "눈 건강",
    "간 건강",
    "스트레스",
    "수면",
    "장 건강",
]);

const mainImage = ref(null);
const mainImagePreview = ref(null);
const images = ref([]);
const imagePreviews = ref([]);

const handleMainImageSelection = (event) => {
    const file = event.target.files[0];
    if(file) {
        mainImage.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            mainImagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    event.target.value = "";
};

const removeMainImage = () => {
  mainImage.value = null;
  mainImagePreview.value = null;
};

const handleImageSelection = (event) => {
    const files = Array.from(event.target.files);

    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreviews.value.push(e.target.result);
            images.value.push(file);
        };
        reader.readAsDataURL(file);
    });

    event.target.value = ""; // 같은 파일 선택 가능하도록 초기화
};

const onImageOrderChanged = (event) => {
    // 변경된 순서에 맞게 원본 images 배열도 재정렬
    const movedImage = images.value.splice(event.oldIndex, 1)[0];
    images.value.splice(event.newIndex, 0, movedImage);
};


const removeImage = (index) => {
    imagePreviews.value.splice(index, 1);
    images.value.splice(index, 1);
};

const handleSubmit = async () => {
    try {
        
        if (!mainImage.value) {
            alert("메인 이미지를 선택해주세요.");
            return;
        }

        if (!images.value.length) {
            alert("상세 이미지를 선택해주세요.");
            return;
        }

        const productResponse = await api.post('/products', product);
        const productId = productResponse.data.productId;

        const mainImageData = new FormData();
        mainImageData.append("image", mainImage.value);

        await api.post(`/products/${productId}/images`, mainImageData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        for (const image of images.value) {
            const formData = new FormData();
            formData.append("image", image);

            await api.post(`/products/${productId}/images`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        }

         // AI 이미지 생성 작업 요청
         api.post(`/products/${productId}/ai-image`).then(() => {
            console.log("AI 이미지 생성 요청 완료");
        }).catch(err => {
            console.error("AI 이미지 생성 요청 실패", err);
        });

        alert('상품이 등록되었습니다!');
        router.push('/seller');
    } catch (error) {
        console.error("상품 등록 실패:", error.response?.data || error.message);
        alert("상품 등록에 실패했습니다.");
    }
};
</script>

<style scoped>
.drag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    /* 이미지 간 간격 */
}
</style>