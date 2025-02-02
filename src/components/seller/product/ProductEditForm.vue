<template>
  <v-form ref="form" @submit.prevent="emitSubmit">
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
      outlined dense required
    ></v-select>

    <!-- 영양소 선택 -->
    <v-select
      v-model="product.nutrientId"
      :items="nutrients"
      item-title="name"
      item-value="nutrientId"
      label="영양소 선택 *"
      outlined dense required
    ></v-select>

     <!-- 페르소나 이미지 -->
     <h3>
      페르소나 이미지
      <v-btn
        small
        color="blue"
        @click="emitPersonaRegeneration"
        :disabled="isLoading"
      >
        재생성
        <v-progress-circular
          v-if="isLoading"
          indeterminate
          size="20"
          color="green"
          class="ml-2"
        />
      </v-btn>
    </h3>
    <v-img
      v-if="personaImage"
      :src="personaImage"
      alt="페르소나 이미지"
      height="150"
      class="mb-4"
    />

    <!-- 메인 이미지 -->
    <h3>메인 이미지 업로드 *</h3>
    <input type="file" accept="image/*" @change="handleMainImageSelection" />
    <v-row class="mb-12">
      <v-col cols="auto" v-if="mainImagePreview">
        <v-img :src="mainImagePreview" alt="메인 이미지 미리보기" height="100" />
        <v-btn small color="red" @click="removeMainImage(product.images.find(img => img.position === 1)?.imageId)">삭제</v-btn>
      </v-col>
    </v-row>

    <!-- 상세 이미지 업로드 -->
    <h3>상세 이미지 업로드 *</h3>
    <input type="file" multiple accept="image/*" @change="uploadDetailImages" />
    <draggable v-model="imagePreviews" :options="{ animation: 200 }" itemKey="index" class="drag-container">
      <template #item="{ element, index }">
        <div class="image-item">
          <v-img :src="element.imageUrl" alt="상세 이미지 미리보기" height="80" />
          <v-btn small color="red" @click="removeDetailImage(element.imageId, index)">삭제</v-btn>
        </div>
      </template>
    </draggable>

    <br>

    <!-- 가격과 재고 -->
    <v-row>
      <v-text-field v-model="product.price" label="가격 *" type="number" required />
      <v-text-field v-model="product.stock" label="재고 *" type="number" required />
    </v-row>

    <!-- 저장 버튼 -->
    <v-btn type="submit" color="green" block class="mt-4">저장하기</v-btn>
  </v-form>
</template>

<script setup>
import { reactive, ref, defineProps, defineEmits } from 'vue';
import draggable from "vuedraggable";
import api from "../../../api/axios";

const emit = defineEmits(['regeneratePersona', 'submitProduct', 'loadingStateUpdate']);

const emitPersonaRegeneration = () => {
  emit('regeneratePersona', product.productId);
  emit('loadingStateUpdate', true); // 로딩 시작 알림
};

const emitSubmit = () => {
  emit('submitProduct', { ...product });
};

const props = defineProps({
  initialProduct: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  categories: {
    type: Array,
    required: true,
  },
  nutrients: {
    type: Array,
    required: true,
  },
});

const product = reactive({
  ...props.initialProduct,
  categoryId: props.initialProduct.categoryId || null,
  nutrientId: props.initialProduct.nutrientId || null,
});

const personaImage = ref(product.images.find(img => img.position === 0)?.imageUrl || null);
const mainImagePreview = ref(product.images.find(img => img.position === 1)?.imageUrl || null);
const imagePreviews = ref(product.images.filter(img => img.position > 1));

// 메인 이미지 업로드
const handleMainImageSelection = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const existingMainImageId = product.images.find(img => img.position === 1)?.imageId;

  if (existingMainImageId) {
    // 기존 메인 이미지 삭제
    const confirmDelete = confirm(
      '이미 메인 이미지가 등록되어 있습니다. 기존 이미지를 삭제하고 새로운 이미지를 등록하시겠습니까?'
    );
    if (!confirmDelete) return;

    await removeMainImage(existingMainImageId); // 기존 메인 이미지 삭제
  }

  // 새로운 메인 이미지 업로드
  try {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(
      `/products/${product.productId}/images/upload-main-image`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    mainImagePreview.value = response.data.fileUrl; // 프리뷰 업데이트
    alert('새로운 메인 이미지가 등록되었습니다.');
  } catch (error) {
    console.error('메인 이미지 업로드 실패:', error.response?.data || error.message);
    alert('메인 이미지 업로드에 실패했습니다.');
  }
};

// 상세 이미지 업로드
const uploadDetailImages = async (event) => {
  const files = Array.from(event.target.files);
  for (const file of files) {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await api.post(`/products/${product.productId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      imagePreviews.value.push({
        imageId: null, // 새로운 이미지는 아직 ID가 없으므로 null
        imageUrl: response.data.fileUrl, // 프리뷰 업데이트
      });
      alert('상세 이미지가 성공적으로 등록되었습니다.');
    } catch (error) {
      console.error('상세 이미지 업로드 실패:', error.response?.data || error.message);
      alert('상세 이미지 업로드에 실패했습니다.');
    }
  }
};

// 이미지 삭제
const removeMainImage = async (imageId) => {
  if (!imageId) {
    alert('이미지 ID가 없습니다.');
    return;
  }

  try {
    await api.delete(`/products/${product.productId}/images/${imageId}`);
    mainImagePreview.value = null;
    alert('메인 이미지가 삭제되었습니다.');
  } catch (error) {
    console.error('메인 이미지 삭제 실패:', error.response?.data || error.message);
    alert('메인 이미지 삭제에 실패했습니다.');
  }
};

const removeDetailImage = async (imageId, index) => {
  try {
    if (!imageId) {
      imagePreviews.value.splice(index, 1);
      return;
    }
    await api.delete(`/products/${product.productId}/images/${imageId}`);
    imagePreviews.value.splice(index, 1);
    alert('이미지가 성공적으로 삭제되었습니다.');
  } catch (error) {
    console.error('이미지 삭제 실패:', error.response?.data || error.message);
    alert('이미지 삭제에 실패했습니다.');
  }
};

</script>


<style scoped>
.drag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
