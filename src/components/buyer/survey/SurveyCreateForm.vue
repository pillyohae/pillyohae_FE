<template>
  <v-container>
    <!-- 프로그레스 바: 전체 단계 대비 현재 단계 비율 -->
    <v-progress-linear :value="progress" height="6" color="blue" class="mb-4" />

    <!-- v-stepper: 스텝 기반 UI 구현 -->
    <v-stepper v-model="step">
      <!-- 스텝 헤더 -->
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          건강 목표 선택 (최대 3개)
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 2" step="2">
          개인 정보
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 3" step="3">
          복용 중인 영양제
        </v-stepper-step>
        <v-divider />
        <v-stepper-step :complete="step > 4" step="4">
          건강 상태 및 식습관
        </v-stepper-step>
        <v-divider />
        <v-stepper-step step="5">
          생활 습관
        </v-stepper-step>
      </v-stepper-header>

      <!-- 스텝 내용 -->
      <v-stepper-items>
        <!-- 1단계: 건강 목표 선택 -->
        <v-stepper-content step="1">
          <v-card class="pa-4">
            <v-card-title>건강 목표를 선택해주세요</v-card-title>
            <v-card-text>
              <v-row>
                <v-col
                  v-for="goal in healthGoalOptions"
                  :key="goal"
                  cols="6"
                  md="3"
                  class="d-flex justify-center"
                >
                  <v-btn
                    :color="form.healthGoals.includes(goal) ? 'green' : 'grey lighten-2'"
                    block
                    @click="toggleHealthGoal(goal)"
                  >
                    <span v-if="form.healthGoals.includes(goal)">
                      {{ form.healthGoals.indexOf(goal) + 1 }}위
                    </span>
                    {{ goal }}
                  </v-btn>
                </v-col>
              </v-row>
              <p class="mt-2">{{ form.healthGoals.length }}/3개 선택 완료</p>
            </v-card-text>
          </v-card>
          <v-btn color="primary" class="mt-4" @click="nextStep" :disabled="form.healthGoals.length === 0">
            다음
          </v-btn>
        </v-stepper-content>

        <!-- 2단계: 개인 정보 입력 -->
        <v-stepper-content step="2">
          <v-card class="pa-4">
            <v-card-title>개인 정보 입력</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.age"
                label="연령"
                type="number"
                required
              />
              <v-radio-group v-model="form.gender" row>
                <v-radio label="남성" value="남성" />
                <v-radio label="여성" value="여성" />
              </v-radio-group>
            </v-card-text>
          </v-card>
          <div class="d-flex justify-space-between mt-4">
            <v-btn text @click="prevStep">이전</v-btn>
            <v-btn color="primary" @click="nextStep" :disabled="!form.age || !form.gender">
              다음
            </v-btn>
          </div>
        </v-stepper-content>

        <!-- 3단계: 복용 중인 영양제 입력 (자동완성) -->
        <v-stepper-content step="3">
          <v-card class="pa-4">
            <v-card-title>현재 복용 중인 영양제</v-card-title>
            <v-card-text>
              <v-autocomplete
                v-model="form.supplements"
                :items="supplementOptions"
                label="영양제 선택"
                multiple
                chips
                clearable
              />
            </v-card-text>
          </v-card>
          <div class="d-flex justify-space-between mt-4">
            <v-btn text @click="prevStep">이전</v-btn>
            <v-btn color="primary" @click="nextStep">
              다음
            </v-btn>
          </div>
        </v-stepper-content>

        <!-- 4단계: 건강 상태 및 식습관 -->
        <v-stepper-content step="4">
          <v-card class="pa-4">
            <v-card-title>건강 상태 및 식습관</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.medicalConditions"
                label="현재 건강 상태 (예: 고혈압, 당뇨)"
                clearable
              />
              <v-checkbox-group v-model="form.dietaryRestrictions">
                <v-checkbox label="유당 불내증" value="유당 불내증" />
                <v-checkbox label="글루텐 불내증" value="글루텐 불내증" />
                <v-checkbox label="채식주의" value="채식주의" />
                <v-checkbox label="비건" value="비건" />
              </v-checkbox-group>
            </v-card-text>
          </v-card>
          <div class="d-flex justify-space-between mt-4">
            <v-btn text @click="prevStep">이전</v-btn>
            <v-btn color="primary" @click="nextStep">
              다음
            </v-btn>
          </div>
        </v-stepper-content>

        <!-- 5단계: 생활 습관 및 추가 정보 -->
        <v-stepper-content step="5">
          <v-card class="pa-4">
            <v-card-title>생활 습관 및 추가 정보</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="form.exerciseFrequency"
                label="운동 빈도 (예: 주 3회)"
              />
              <v-radio-group v-model="form.smoking" row>
                <v-radio label="흡연 있음" value="yes" />
                <v-radio label="흡연 없음" value="no" />
              </v-radio-group>
              <v-text-field
                v-model="form.sleepQuality"
                label="수면의 질 (예: 좋음/보통/나쁨)"
              />
              <v-text-field
                v-model="form.stressLevel"
                label="스트레스 수준 (예: 낮음/중간/높음)"
              />
            </v-card-text>
          </v-card>
          <div class="d-flex justify-space-between mt-4">
            <v-btn text @click="prevStep">이전</v-btn>
            <v-btn color="success" @click="submitSurvey">
              설문 저장하기
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../../api/axios';

// 현재 스텝 (1부터 시작)
const step = ref(1);
const totalSteps = 5;
const progress = computed(() => (step.value / totalSteps) * 100);

// 설문 입력값 (DTO) 객체
const form = ref({
  healthGoals: [],           // 건강 목표: 최대 3개 선택
  age: null,                 // 연령
  gender: '',                // 성별
  supplements: [],           // 복용 중인 영양제 (다중 선택)
  medicalConditions: '',     // 건강 상태 (예: 고혈압, 당뇨)
  dietaryRestrictions: [],   // 식습관 및 알러지 (다중 선택)
  // 생활 습관 관련 정보
  exerciseFrequency: '',
  smoking: '',
  sleepQuality: '',
  stressLevel: ''
});

// 건강 목표 옵션 (예: 10가지)
const healthGoalOptions = [
  '면역력 강화',
  '피로 회복',
  '다이어트',
  '집중력 향상',
  '소화 개선',
  '혈액순환 개선',
  '항산화 효과',
  '노화 방지',
  '에너지 증가',
  '스트레스 해소'
];

// 영양제 옵션 (예시)
const supplementOptions = [
  '비타민C',
  '오메가3',
  '비타민D',
  '종합비타민',
  '프로바이오틱스',
  '마그네슘'
];

// 건강 목표 선택 토글 (최대 3개)
const toggleHealthGoal = (goal) => {
  const idx = form.value.healthGoals.indexOf(goal);
  if (idx !== -1) {
    form.value.healthGoals.splice(idx, 1);
  } else if (form.value.healthGoals.length < 3) {
    form.value.healthGoals.push(goal);
  }
};

// 단계 이동 함수
const nextStep = () => {
  if (step.value < totalSteps) {
    step.value++;
  }
};

const prevStep = () => {
  if (step.value > 1) {
    step.value--;
  }
};

// 설문 제출 및 AI 추천 요청
const router = useRouter();
const submitSurvey = async () => {
  const surveyDTO = {
    healthGoals: form.value.healthGoals,
    age: form.value.age,
    gender: form.value.gender,
    supplements: form.value.supplements,
    medicalConditions: form.value.medicalConditions,
    dietaryRestrictions: form.value.dietaryRestrictions,
    lifestyle: {
      exerciseFrequency: form.value.exerciseFrequency,
      smoking: form.value.smoking,
      sleepQuality: form.value.sleepQuality,
      stressLevel: form.value.stressLevel
    }
  };

  try {
    const response = await api.post('/surveys', surveyDTO);
    await api.post(`/surveys/${response.data.surveyId}/recommendations`);
    alert('설문 저장 및 추천 상품 생성이 완료되었습니다!');
    router.push('/survey');
  } catch (error) {
    console.error('설문 저장 실패:', error);
    alert('설문 저장에 실패했습니다.');
  }
};
</script>
