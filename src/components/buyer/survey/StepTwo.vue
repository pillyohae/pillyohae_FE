<template>
    <v-container class="step-two-container" fluid>
      <v-row justify="center">
        <v-col cols="12" class="content" md="8">
          <!-- 페이지 제목 -->
          <h2 class="header">건강 목표 및 상태 입력</h2>
  
          <!-- 건강 목표 선택 영역 -->
          <div class="section">
            <p class="section-title">건강 목표 선택 (최대 3개)</p>
            <v-container>
              <v-row class="goal-grid" justify="center">
                <v-col
                  v-for="goal in healthGoalOptions"
                  :key="goal"
                  cols="4"
                  class="d-flex justify-center"
                >
                  <v-btn
                    block
                    depressed
                    @click="toggleGoal(goal)"
                    :class="isSelected(goal) ? 'selected-goal' : 'not-selected-goal'"
                  >
                    {{ goal }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </div>
  
          <!-- 구분선 -->
          <v-divider class="my-4"></v-divider>
  
          <!-- 건강 상태 입력 영역 -->
          <div class="section">
            <p class="section-title">건강 상태 입력</p>
            <v-text-field
              v-model="formStore.healthCondition"
              label="예: 고혈압, 당뇨, 유당불내증 등"
              outlined
              dense
              class="custom-input"
            ></v-text-field>
          </div>
  
          <!-- 하단 버튼 그룹 -->
          <v-row class="button-group" justify="space-between" align-center>
            <v-col cols="5">
              <v-btn class="prev-btn" @click="prev">이전</v-btn>
            </v-col>
            <v-col cols="5">
              <v-btn class="next-btn" @click="next">다음</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { useFormStore } from '../../../stores/formStore';
  import { defineEmits } from 'vue';
  
  const emits = defineEmits(['next', 'prev']);
  const formStore = useFormStore();
  
  const healthGoalOptions = [
    '혈액 순환 개선',
    '소화개선',
    '피부',
    '눈',
    '두뇌활동',
    '피로회복',
    '다이어트',
    '집중력 향상',
    '뼈/관절',
    '면역력 강화',
    '모발',
    '선택안함'
  ];
  
  const toggleGoal = (goal) => {
    const index = formStore.healthGoals.indexOf(goal);
    if (index !== -1) {
      formStore.healthGoals.splice(index, 1);
    } else {
      if (formStore.healthGoals.length < 3) {
        formStore.healthGoals.push(goal);
      } else {
        alert('최대 3개까지만 선택할 수 있습니다.');
      }
    }
  };
  
  const isSelected = (goal) => {
    return formStore.healthGoals.includes(goal);
  };
  
  const next = () => {
    emits('next');
  };
  
  const prev = () => {
    emits('prev');
  };
  </script>
  
  <style scoped>
  /* 전체 컨테이너: 밝은 연두색 배경, 중앙 정렬 및 충분한 패딩 */
  .step-two-container {
    background-color: #ffffff;
    padding: 30px;
    min-height: 100vh;
  }
  
  /* 내부 콘텐츠: 최대 너비 600px로 넓혀서 여유 공간 확보 */
  .content {
    max-width: 600px;
    margin: auto;
  }
  
  /* 페이지 헤더 */
  .header {
    text-align: center;
    color: #000000;
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }
  
  /* 섹션: 영역 간 여백 */
  .section {
    margin-bottom: 20px;
  }
  
  /* 섹션 타이틀: 건강 목표 및 상태 입력 구분 */
  .section-title {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
    margin-bottom: 15px;
    text-align: center;
  }
  
  /* 목표 선택 버튼 그리드: 균등한 배치를 위해 cols="4" 사용 */
  .goal-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
  }
  
  /* 선택되지 않은 목표 버튼: 흰색 배경, 연두색 테두리 및 텍스트 */
  .not-selected-goal {
    background-color: #FFFFFF !important;
    color: #4CAF50 !important;
    border: 2px solid #4CAF50;
    border-radius: 12px;
    text-transform: none;
    height: 50px;
    width: 100%;
  }
  
  /* 선택된 목표 버튼: 연두색 배경, 흰색 텍스트, 그림자 효과 */
  .selected-goal {
    background-color: #4CAF50 !important;
    color: #FFFFFF !important;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
    border-radius: 12px;
    text-transform: none;
    height: 50px;
    width: 100%;
  }
  
  /* 커스텀 입력 필드: 둥근 테두리 및 내부 패딩 */
  .custom-input .v-field__control {
    border-radius: 8px;
    border: 1px solid #ddd;
    padding: 10px 15px;
  }
  
  /* 버튼 그룹: 하단 버튼 중앙 정렬 및 간격 */
  .button-group {
    margin-top: 30px;
  }
  
  /* 이전 버튼: 투명 배경, 연두색 테두리 */
  .prev-btn {
    background-color: transparent !important;
    color: #4CAF50 !important;
    border: 2px solid #4CAF50;
    border-radius: 25px;
    height: 50px;
    width: 100%;
    transition: filter 0.3s;
  }
  
  /* 다음 버튼: 연두색 배경, 흰색 텍스트 */
  .next-btn {
    background-color: #4CAF50 !important;
    color: #FFFFFF !important;
    border-radius: 25px;
    height: 50px;
    width: 100%;
    transition: filter 0.3s;
  }
  
  .prev-btn:hover,
  .next-btn:hover {
    filter: brightness(90%);
  }
  </style>
  