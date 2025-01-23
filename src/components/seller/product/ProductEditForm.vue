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
  
      <!-- 메인 이미지 -->
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
  import { reactive, ref, defineProps } from 'vue';
  import draggable from "vuedraggable";

  const props = defineProps({
    initialProduct: {
      type: Object,
      required: true,
    },
  });
  
  const product = reactive({ ...props.initialProduct });
  const categories = ref(['멀티비타민', '관절/뼈', '눈 건강', '간 건강', '스트레스', '수면', '장 건강']);
  const mainImage = ref(null);
  const mainImagePreview = ref(product.imageUrls?.[0] || null);
  const imagePreviews = ref(product.imageUrls?.slice(1) || []);
  
  const handleMainImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        mainImagePreview.value = e.target.result;
      };
      reader.readAsDataURL(file);
      mainImage.value = file;
    }
  };
  
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
  
  const removeImage = (index) => {
    imagePreviews.value.splice(index, 1);
  };
  
  const handleSubmit = async () => {
    try {
      // 상품 정보 업데이트 로직 추가
      console.log('저장:', product);
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
    /* 이미지 간 간격 */
}</style>