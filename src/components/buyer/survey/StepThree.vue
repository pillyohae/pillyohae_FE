<template>
  <v-container class="lifestyle-container" fluid>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <h2 class="header">생활습관 정보 입력</h2>

        <div class="section">
          <p class="section-title">운동 빈도 (주 몇 회)</p>
          <v-text-field
            v-model="formStore.lifestyle.exercise"
            type="number"
            label="운동 횟수"
            outlined
            dense
            class="custom-input"
          ></v-text-field>
        </div>

        <div class="section">
          <p class="section-title">흡연 여부</p>
          <v-select
            v-model="formStore.lifestyle.smoking"
            :items="smokingOptions"
            label="흡연 여부 선택"
            outlined
            dense
            class="custom-input"
          ></v-select>
        </div>

        <div class="section">
          <p class="section-title">수면의 질</p>
          <v-select
            v-model="formStore.lifestyle.sleepQuality"
            :items="sleepQualityOptions"
            label="수면 상태 선택"
            outlined
            dense
            class="custom-input"
          ></v-select>
        </div>

        <div class="section">
          <p class="section-title">스트레스 수준</p>
          <v-select
            v-model="formStore.lifestyle.stressLevel"
            :items="stressLevelOptions"
            label="스트레스 정도 선택"
            outlined
            dense
            class="custom-input"
          ></v-select>
        </div>

        <!-- 버튼 그룹 -->
        <v-row class="button-group" justify="space-between">
          <v-col cols="5">
            <v-btn class="prev-btn" @click="prev">이전</v-btn>
          </v-col>
          <v-col cols="5">
            <v-btn 
              class="submit-btn" 
              @click="submit" 
              :disabled="isLoading"
            >
              <v-progress-circular 
                v-if="isLoading" 
                indeterminate 
                size="20" 
                color="white" 
                class="mr-2"
              />
              {{ isLoading ? "처리 중..." : "제출" }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useFormStore } from '../../../stores/formStore';
import { defineEmits, ref } from 'vue';

const emits = defineEmits(['prev', 'submit']);
const formStore = useFormStore();
const isLoading = ref(false);

const smokingOptions = ['흡연 O', '흡연 X'];
const sleepQualityOptions = ['좋음', '보통', '나쁨'];
const stressLevelOptions = ['낮음', '중간', '높음'];

const prev = () => {
  emits('prev');
};

const submit = () => {
  isLoading.value = true; // 로딩 시작
  emits('submit', () => {
    isLoading.value = false; // 로딩 완료 후 해제
  });
};
</script>

<style scoped>
/* 전체 컨테이너 스타일 */
.lifestyle-container {
  background-color: #ffffff;
  padding: 30px;
  min-height: 100vh;
}

/* 제목 스타일 */
.header {
  text-align: center;
  font-size: 22px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 20px;
}

/* 섹션 레이아웃 */
.section {
  margin-bottom: 20px;
}

/* 섹션 제목 */
.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 10px;
}

/* 입력 필드 스타일 */
.custom-input .v-field__control {
  border-radius: 8px;
  border: 1px solid #ddd;
  padding: 10px 15px;
}

/* 버튼 그룹 */
.button-group {
  margin-top: 20px;
}

/* 이전 버튼 */
.prev-btn {
  background-color: transparent !important;
  color: #4CAF50 !important;
  border: 2px solid #4CAF50;
  border-radius: 25px;
  height: 50px;
  width: 100%;
  transition: filter 0.3s;
}

/* 제출 버튼 */
.submit-btn {
  background-color: #4CAF50 !important;
  color: #FFFFFF !important;
  border-radius: 25px;
  height: 50px;
  width: 100%;
  transition: filter 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.prev-btn:hover,
.submit-btn:hover {
  filter: brightness(90%);
}
</style>
