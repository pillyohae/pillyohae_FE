<template>
    <v-form @submit.prevent="handleSubmit">
        <v-text-field v-model="couponData.couponName" label="쿠폰 제목" required />
        <v-textarea v-model="couponData.couponDescription" label="쿠폰 설명" required />

        <!-- 할인 유형 -->
        <v-select v-model="couponData.discountType" :items="discountTypes" label="할인 유형" required />

        <!-- 할인 값 -->
        <v-text-field v-if="couponData.discountType === 'FIXED_AMOUNT'" v-model.number="couponData.fixedAmount"
            label="할인 금액" type="number" required />
        <v-text-field v-if="couponData.discountType === 'PERCENTAGE'" v-model.number="couponData.fixedRate"
            label="할인율 (%)" type="number" required />
        <v-text-field v-if="couponData.discountType === 'PERCENTAGE'" v-model.number="couponData.maxDiscountAmount"
            label="최대 할인 금액" type="number" required />

        <!-- 최소 결제 금액 -->
        <v-text-field v-model.number="couponData.minimumPrice" label="최소 결제 금액" type="number" required />

        <!-- 만료일 -->
        <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
    <template v-slot:activator="{ props }">
        <v-text-field v-bind="props" v-model="formattedExpiredAt" label="만료일" readonly />
    </template>
    <v-date-picker 
        v-model="localExpiredAt" 
        @update:modelValue="updateExpiredAt" 
    />
</v-menu>


        <!-- 쿠폰 발급 수 -->
        <v-text-field v-model.number="couponData.maxIssueCount" label="발급 가능한 쿠폰 수" type="number" required />

        <!-- 저장 버튼 -->
        <v-btn type="submit" color="green" block class="mt-6">
            쿠폰 생성하기
        </v-btn>
    </v-form>
</template>

<script setup>
import { reactive, ref, computed, defineEmits } from 'vue';

const discountTypes = ['FIXED_AMOUNT', 'PERCENTAGE'];
const emit = defineEmits(['submitCoupon']);

// 날짜를 LocalDateTime 형식으로 변환하는 유틸리티 함수
const formatDateToLocalDateTime = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};


const couponData = reactive({
    couponName: '',
    couponDescription: '',
    discountType: 'FIXED_AMOUNT',
    expiredType: "FIXED_DATE",
    fixedAmount: null,
    fixedRate: null,
    maxDiscountAmount: null,
    minimumPrice: null,
    startAt: formatDateToLocalDateTime(new Date(Date.now() + 30000)), // 현재 시각 + 30초
    expiredAt: null,
    maxIssueCount: null,
});

const dateMenu = ref(false);
const localExpiredAt = ref(null); // 캘린더로 선택한 날짜 저장

const formattedExpiredAt = computed(() => {
    if (!localExpiredAt.value) return '';
    const selectedDate = new Date(localExpiredAt.value);
    return selectedDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
});

const updateExpiredAt = (date) => {
    if (!date) return;

    // 만료일을 23:59:59로 설정
    const expiredDate = new Date(date);
    expiredDate.setHours(23, 59, 59, 999);

    // LocalDateTime 형식으로 변환
    const toLocalDateTime = (date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    // `localExpiredAt`과 `expiredAt` 값 업데이트
    localExpiredAt.value = date;
    couponData.expiredAt = toLocalDateTime(expiredDate);

    console.log('선택된 만료일:', couponData.expiredAt);

    // 메뉴 닫기
    dateMenu.value = false;
};

const handleSubmit = () => {
    console.log('서버로 보낼 데이터:', couponData);
    emit('submitCoupon', couponData);
};
</script>
