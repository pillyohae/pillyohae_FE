<template>
    <v-container>
        <SurveyProgressBar :step="step" :totalSteps="totalSteps" />
        <transition name="fade" mode="out-in">
            <StepOne v-if="step === 1" @next="nextStep" key="step1" />
            <StepTwo v-else-if="step === 2" @next="nextStep" @prev="prevStep" key="step2" />
            <StepThree v-else-if="step === 3" @prev="prevStep" @submit="submitForm" key="step3" />
        </transition>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SurveyProgressBar from './SurveyProgressBar.vue';
import StepOne from './StepOne.vue';
import StepTwo from './StepTwo.vue';
import StepThree from './StepThree.vue';
import { useFormStore } from '../../../stores/formStore';
import api from '../../../api/axios';

const step = ref(1);
const totalSteps = 3;
const router = useRouter();

const nextStep = () => {
    if (step.value < totalSteps) step.value++;
};

const prevStep = () => {
    if (step.value > 1) step.value--;
};

const submitForm = async () => {
    const formStore = useFormStore();
    console.log('제출 데이터:', formStore.$state);
    try {
        const response = await api.post('/surveys', formStore.$state);
        await api.post(`/surveys/${response.data.surveyId}/recommendations`);
        alert('설문 저장 및 추천 상품 생성이 완료되었습니다!');
        router.push('/survey');
    } catch (error) {
        console.error('설문 저장 실패:', error);
        alert('설문 저장에 실패했습니다.');
    }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>