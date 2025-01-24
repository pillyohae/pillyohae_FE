<template>
  <v-form ref="form" @submit.prevent="handleSubmit">
    <!-- 상품 이름 -->
    <v-text-field v-model="product.productName" label="영양제 이름 *" required />

    <!-- 회사 이름 -->
    <v-text-field v-model="product.companyName" label="영양제 회사 *" required />

    <!-- 상품 설명 -->
    <v-textarea v-model="product.description" label="영양제 설명 *" required></v-textarea>

    <!-- 카테고리 선택 -->
    <h3>카테고리 선택 *</h3>
    <v-btn
      v-for="category in categories"
      :key="category"
      :color="product.category === category ? 'green' : 'grey'"
      outlined
      class="mr-2 mb-12"
      @click="product.category = category"
    >
      {{ category }}
    </v-btn>

    <h3>
      페르소나 이미지
      <v-btn small color="blue" @click="emitPersonaRegeneration">
        재생성
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
        <v-btn small color="red" @click="removeMainImage">삭제</v-btn>
      </v-col>
    </v-row>

    <!-- 상세 이미지 업로드 -->
    <h3>상세 이미지 업로드 *</h3>
    <input type="file" multiple accept="image/*" @change="handleImageSelection" />
    <draggable v-model="imagePreviews" :options="{ animation: 200 }" itemKey="index" class="drag-container">
      <template #item="{ element, index }">
        <div class="image-item">
          <v-img :src="element" alt="상세 이미지 미리보기" height="80" />
          <v-btn small color="red" @click="removeImage(index)">삭제</v-btn>
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

const emit = defineEmits(['regeneratePersona']);

const emitPersonaRegeneration= () => {
  emit('regeneratePersona', product.productId);
}

const props = defineProps({
  initialProduct: {
    type: Object,
    required: true,
  },
});

// 데이터 초기화
const product = reactive({ ...props.initialProduct });
const categories = ref(['멀티비타민', '관절/뼈', '눈 건강', '간 건강', '스트레스', '수면', '장 건강']);

// 이미지 분리
const personaImage = ref(product.images.find(img => img.position === 0)?.imageUrl || null);
const mainImagePreview = ref(product.images.find(img => img.position === 1)?.imageUrl || null);
const imagePreviews = ref(
  product.images.filter(img => img.position > 1).map(img => img.imageUrl)
);

// 메인이미지 변경 핸들러
const handleMainImageSelection = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      mainImagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// 상세이미지 추가 핸들러
const handleImageSelection = (event) => {
  const files = Array.from(event.target.files);
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

// 상세이미지 삭제
const removeImage = (index) => {
  imagePreviews.value.splice(index, 1);
};

// 저장 로직
const handleSubmit = async () => {
  try {
    console.log('저장 데이터:', product);
    // 저장 로직 추가
  } catch (error) {
    console.error('저장 실패:', error.message);
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
