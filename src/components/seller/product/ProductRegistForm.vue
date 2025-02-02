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
            <v-select 
                v-model="product.categoryId" 
                :items="categories" 
                item-title="name" 
                item-value="categoryId"
                label="카테고리 선택 *" 
                outlined 
                dense 
                required
            ></v-select>

            <!-- 영양소 선택 (하나만 선택 가능) -->
            <v-select 
                v-model="product.nutrientId" 
                :items="nutrients" 
                item-title="name" 
                item-value="nutrientId"
                label="영양소 선택 *" 
                outlined 
                dense 
                required
            ></v-select>

            <h3>메인 이미지 업로드 * (이 이미지는 페르소나 이미지 생성에 사용될 이미지입니다!)</h3>
            <input type="file" accept="image/*" @change="handleMainImageSelection" />
            <v-row class="mb-12">
                <v-col cols="auto" v-if="mainImagePreview">
                    <v-img :src="mainImagePreview" alt="메인 이미지 미리보기" height="100" />
                    <v-btn small color="red" @click="removeMainImage">삭제</v-btn>
                </v-col>
            </v-row>

            <!-- 이미지 업로드 -->
            <h3>상세 이미지 업로드 *</h3>
            <input type="file" multiple accept="image/*" @change="handleImageSelection" />
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

            <!-- 가격 및 재고 -->
            <v-row>
                <v-text-field v-model="product.price" label="가격 *" type="number" required />
                <v-text-field v-model="product.stock" label="재고 *" type="number" required />
            </v-row>

            <!-- 등록 버튼 -->
            <v-btn type="submit" color="green" block class="mt-4">등록하기</v-btn>
        </v-form>
    </v-container>
</template>

<script setup>
import api from "../../../api/axios";
import router from "../../../router";
import { reactive, ref, onMounted } from "vue";
import draggable from "vuedraggable";

// 상품 정보 (영양소 선택을 단일 ID로 변경)
const product = reactive({
    productName: "",
    categoryId: null, // 선택한 카테고리 ID
    nutrientId: null, // 선택한 영양소 ID (배열이 아니라 단일 값)
    description: "",
    companyName: "",
    price: null,
    stock: null,
});

// 서버에서 가져올 카테고리 & 영양소 목록
const categories = ref([]);
const nutrients = ref([]);

const mainImage = ref(null);
const mainImagePreview = ref(null);
const images = ref([]);
const imagePreviews = ref([]);

// 서버에서 카테고리 및 영양소 목록 가져오기
const fetchCategoryAndNutrients = async () => {
    try {
        const categoryResponse = await api.get('/products/categories');
        categories.value = categoryResponse.data;

        const nutrientResponse = await api.get('/products/nutrients');
        nutrients.value = nutrientResponse.data;
    } catch (error) {
        console.error("카테고리 및 영양소 목록 불러오기 실패:", error.response?.data || error.message);
        alert("카테고리 및 영양소 목록을 불러오지 못했습니다.");
    }
};

// 메인 이미지 선택
const handleMainImageSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
        mainImage.value = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            mainImagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    event.target.value = "";
};

// 메인 이미지 삭제
const removeMainImage = () => {
    mainImage.value = null;
    mainImagePreview.value = null;
};

// 상세 이미지 선택
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

// 이미지 순서 변경
const onImageOrderChanged = (event) => {
    const movedImage = images.value.splice(event.oldIndex, 1)[0];
    images.value.splice(event.newIndex, 0, movedImage);
};

// 상세 이미지 삭제
const removeImage = (index) => {
    imagePreviews.value.splice(index, 1);
    images.value.splice(index, 1);
};

// 상품 등록
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

        const productData = {
            ...product,
            nutrientIds: [product.nutrientId], // 서버에서 nutrientIds 배열을 요구하면 배열로 변환
        };

        const productResponse = await api.post('/products', productData);
        const productId = productResponse.data.productId;

        // 메인 이미지 업로드
        const mainImageData = new FormData();
        mainImageData.append("image", mainImage.value);

        await api.post(`/products/${productId}/images`, mainImageData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        // 상세 이미지 업로드
        for (const image of images.value) {
            const formData = new FormData();
            formData.append("image", image);

            await api.post(`/products/${productId}/images`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        }

        // AI 이미지 생성 요청
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

// 컴포넌트 마운트 시 카테고리 및 영양소 목록 가져오기
onMounted(() => {
    fetchCategoryAndNutrients();
});
</script>

<style scoped>
.drag-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
}
</style>
