<template>
    <!-- 쿠폰 생성 폼 -->
    <!-- v-form: Vuetify의 폼 컴포넌트, @submit.prevent는 폼 제출을 방지하고 handleSubmit 호출 -->
    <v-form @submit.prevent="handleSubmit">
        <!-- 쿠폰 제목 입력 -->
        <!-- v-model: couponData.couponName과 양방향 바인딩 -->
        <v-text-field v-model="couponData.couponName" label="쿠폰 제목" required />

        <!-- 쿠폰 설명 입력 -->
        <!-- v-model: couponData.couponDescription과 양방향 바인딩 -->
        <v-textarea v-model="couponData.couponDescription" label="쿠폰 설명" required />

        <!-- 할인 유형 선택 -->
        <!-- v-select: 선택 가능한 할인 유형을 표시 -->
        <!-- v-model: couponData.discountType과 바인딩 -->
        <!-- :items: discountTypes 배열을 표시 -->
        <v-select v-model="couponData.discountType" :items="discountTypes" label="할인 유형" required />

        <!-- 할인 금액 (FIXED_AMOUNT 유형일 때만 표시) -->
        <!-- v-if: 할인 유형이 FIXED_AMOUNT일 경우에만 표시 -->
        <v-text-field v-if="couponData.discountType === 'FIXED_AMOUNT'"
            v-model.number="couponData.fixedAmount" label="할인 금액" type="number" required />

        <!-- 할인율 및 최대 할인 금액 (PERCENTAGE 유형일 때만 표시) -->
        <v-text-field v-if="couponData.discountType === 'PERCENTAGE'"
            v-model.number="couponData.fixedRate" label="할인율 (%)" type="number" required />
        <v-text-field v-if="couponData.discountType === 'PERCENTAGE'"
            v-model.number="couponData.maxDiscountAmount" label="최대 할인 금액" type="number" required />

        <!-- 만료 유형 선택 -->
        <!-- v-select: 만료 유형을 선택 -->
        <!-- :items: expiredTypes 배열을 표시 -->
        <!-- item-title: 표시되는 텍스트 필드 -->
        <!-- item-value: 실제 값으로 사용 -->
        <v-select v-model="couponData.expiredType" :items="expiredTypes" item-title="text" item-value="value"
            label="만료 유형" required />

        <!-- 발급 만료일 (캘린더 UI) -->
        <!-- v-menu: 캘린더 메뉴로 날짜를 선택 -->
        <!-- v-bind="props": 캘린더 열기 버튼에 적용 -->
        <v-menu v-model="dateMenu" :close-on-content-click="false" transition="scale-transition" offset-y>
            <template v-slot:activator="{ props }">
                <!-- 선택된 날짜를 표시하는 텍스트 필드 -->
                <v-text-field v-bind="props" v-model="formattedExpiredAt" label="발급 만료일" readonly required />
            </template>
            <!-- v-date-picker: 날짜를 선택하는 컴포넌트 -->
            <v-date-picker v-model="localExpiredAt" @update:modelValue="updateExpiredAt" />
        </v-menu>

        <!-- 쿠폰 라이프타임 (DURATION_BASED 유형일 때만 표시) -->
        <v-text-field v-if="couponData.expiredType === 'DURATION_BASED'"
            v-model.number="couponData.couponLifetime" label="쿠폰 라이프타임 (일)" type="number" required />

        <!-- 최소 결제 금액 -->
        <!-- v-model.number: 입력 값을 숫자로 처리 -->
        <v-text-field v-model.number="couponData.minimumPrice" label="최소 결제 금액" type="number" required />

        <!-- 발급 가능한 쿠폰 수 -->
        <v-text-field v-model.number="couponData.maxIssueCount" label="발급 가능한 쿠폰 수" type="number" required />

        <!-- 저장 버튼 -->
        <!-- @click: 버튼 클릭 시 handleSubmit 호출 -->
        <v-btn type="submit" color="green" block class="mt-6">
            쿠폰 생성하기
        </v-btn>
    </v-form>
</template>

<script setup>
import { reactive, ref, computed, defineEmits } from 'vue';

// 할인 유형과 만료 유형 선택값
const discountTypes = ['FIXED_AMOUNT', 'PERCENTAGE']; // 할인 유형 리스트
const expiredTypes = [
    { text: '정액 기한 만료 (예: 2025-02-20)', value: 'FIXED_DATE' }, // 특정 날짜 만료
    { text: '정액 일정 기간 유지 (예: 3일)', value: 'DURATION_BASED' } // 특정 기간 만료
];

// 부모 컴포넌트로 쿠폰 데이터 제출 이벤트 정의
const emit = defineEmits(['submitCoupon']);

// 날짜를 LocalDateTime 형식으로 변환하는 유틸리티 함수
const formatDateToLocalDateTimeKST = (date) => {
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC 시간에 9시간 추가
    return `${kstDate.getFullYear()}-${String(kstDate.getMonth() + 1).padStart(2, '0')}-${String(kstDate.getDate()).padStart(2, '0')}T${String(kstDate.getHours()).padStart(2, '0')}:${String(kstDate.getMinutes()).padStart(2, '0')}:${String(kstDate.getSeconds()).padStart(2, '0')}`;
};

// 쿠폰 데이터를 reactive로 관리
const couponData = reactive({
    couponName: '', // 쿠폰 제목
    couponDescription: '', // 쿠폰 설명
    discountType: 'FIXED_AMOUNT', // 할인 유형 (기본값: FIXED_AMOUNT)
    expiredType: 'FIXED_DATE', // 만료 유형 (기본값: FIXED_DATE)
    fixedAmount: null, // 할인 금액 (정액 할인)
    fixedRate: null, // 할인율 (퍼센트 할인)
    maxDiscountAmount: null, // 최대 할인 금액
    minimumPrice: null, // 최소 결제 금액
    startAt: formatDateToLocalDateTimeKST(new Date(Date.now() + 30000)), // 발급 시작 시간
    expiredAt: null, // 만료일
    couponLifetime: null, // 쿠폰 유지 기간 (DURATION_BASED에서 사용)
    maxIssueCount: null, // 발급 가능한 쿠폰 수
});

// 캘린더 메뉴와 선택된 날짜
const dateMenu = ref(false); // 캘린더 메뉴 열림/닫힘 상태
const localExpiredAt = ref(null); // 선택된 날짜

// 선택된 만료일을 포맷팅
const formattedExpiredAt = computed(() => {
    if (!localExpiredAt.value) return ''; // 값이 없으면 빈 문자열 반환
    const selectedDate = new Date(localExpiredAt.value);
    return selectedDate.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
});

// 선택된 만료일을 업데이트하는 함수
const updateExpiredAt = (date) => {
    if (!date) return;

    // 선택된 날짜를 23:59:59로 설정
    const expiredDate = new Date(date);
    expiredDate.setHours(23, 59, 59, 999);

    // LocalDateTime 형식으로 변환 후 쿠폰 데이터 업데이트
    localExpiredAt.value = date;
    couponData.expiredAt = formatDateToLocalDateTimeKST(expiredDate);

    // 메뉴 닫기
    dateMenu.value = false;
};

// 폼 제출 처리
const handleSubmit = () => {
    console.log('서버로 보낼 데이터:', couponData); // 콘솔에 쿠폰 데이터 출력
    emit('submitCoupon', couponData); // 부모 컴포넌트로 데이터 전송
};
</script>
