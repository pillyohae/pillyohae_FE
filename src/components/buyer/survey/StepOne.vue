<template>
    <v-container class="step-one-container">
      <v-card elevation="2" class="pa-4 step-card">
        <v-card-title class="headline justify-center">기본 정보 입력</v-card-title>
        <v-card-text>
          <v-form>
            <v-row dense>
              <!-- 성별 선택 (v-select) -->
              <v-col cols="12">
                <v-select
                  v-model="formStore.gender"
                  :items="genderOptions"
                  label="성별"
                  outlined
                  dense
                  class="custom-input"
                ></v-select>
              </v-col>
              <!-- 나이 입력 -->
              <v-col cols="12">
                <v-text-field
                  v-model="formStore.age"
                  label="나이"
                  type="number"
                  outlined
                  dense
                  class="custom-input"
                ></v-text-field>
              </v-col>
              <!-- 키 입력 -->
              <v-col cols="12">
                <v-text-field
                  v-model="formStore.height"
                  label="키 (cm)"
                  type="number"
                  outlined
                  dense
                  class="custom-input"
                ></v-text-field>
              </v-col>
              <!-- 몸무게 입력 -->
              <v-col cols="12">
                <v-text-field
                  v-model="formStore.weight"
                  label="몸무게 (kg)"
                  type="number"
                  outlined
                  dense
                  class="custom-input"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <!-- 하단 중앙에 배치된 '다음' 버튼 -->
        <v-card-actions class="justify-center">
          <v-btn color="success" class="next-btn" @click="next">
            다음
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { useFormStore } from '../../../stores/formStore';
  import { defineEmits } from 'vue';
  
  const emits = defineEmits(['next']);
  const formStore = useFormStore();
  const genderOptions = ['남성', '여성'];
  
  const next = () => {
    // 필요에 따라 유효성 검사 로직을 추가할 수 있습니다.
    emits('next');
  };
  </script>
  
  <style scoped>
  /* 전체 레이아웃: 중앙 정렬, 라이트 테마 */
  .step-one-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;
    min-height: 80vh;
  }
  
  /* 카드: 최대 너비 400px, 반응형 지원 */
  .step-card {
    max-width: 400px;
    width: 100%;
  }
  
  /* 입력 필드: 둥근 테두리, 부드러운 그림자 및 내부 패딩 */
  .custom-input .v-field__control {
    border-radius: 8px;
    border: 1px solid #ddd;
    padding: 10px 15px;
  }
  
  /* 텍스트 입력 요소 스타일 (focus 시 강조 효과) */
  .custom-input input {
    border: none;
    outline: none;
  }
  
  .custom-input input:focus {
    border-color: #ff5722 !important;
  }
  
  /* '다음' 버튼 스타일 */
  .next-btn {
    border-radius: 25px;
    height: 50px;
    width: 80%;
    color: #ffffff;
    font-weight: bold;
  }
  
  .next-btn:hover {
    opacity: 0.8;
  }
  </style>
  