<template>
  <v-row>
    <!-- 
      쿠폰 목록을 반복 렌더링해 그리드 형태로 표시
      - cols: 모바일 화면에서 전체 너비를 사용
      - md: 중간 화면에서는 한 행에 2개의 카드 배치
      - lg: 큰 화면에서는 한 행에 3개의 카드 배치
      - v-for: coupons 배열에 있는 각 쿠폰 데이터를 반복하여 렌더링
      - :key: Vue가 각 아이템을 고유하게 식별하기 위해 쿠폰 ID를 사용
    -->
    <v-col 
      cols="12" 
      md="6" 
      lg="4" 
      v-for="coupon in coupons" 
      :key="coupon.couponId"
    >
      <!-- 쿠폰 정보를 보여주는 카드 -->
      <!-- outlined: 카드에 테두리 스타일을 추가 -->
      <v-card outlined>
        <!-- 
          카드 상단 제목 영역
          - d-flex justify-space-between align-center: 제목과 토글 버튼을 양 끝에 정렬
          - 쿠폰의 이름과 활성/비활성 상태를 보여줌
        -->
        <v-card-title class="d-flex justify-space-between align-center">
          <!-- 쿠폰 이름 -->
          <span class="text-h6">{{ coupon.couponName }}</span>

          <!-- 
            토글 스위치 (쿠폰 상태 변경)
            - :model-value: 현재 쿠폰 상태를 'ACTIVE'인지 확인해 토글 상태 결정
            - :color: 상태가 'ACTIVE'이면 초록색, 아니면 회색
            - @update:model-value: 토글 상태 변경 시 toggleCouponStatus 함수 호출
            - hide-details: 하단의 불필요한 설명을 숨김
            - inset: 토글 버튼을 더 작게 표시
          -->
          <v-switch
            :model-value="coupon.couponStatus === 'ACTIVE'" 
            :color="coupon.couponStatus === 'ACTIVE' ? 'green' : 'grey'" 
            @update:model-value="(newValue) => toggleCouponStatus(coupon, newValue)" 
            hide-details
            inset
          />
        </v-card-title>

        <!-- 
          카드 부제목 영역
          - 쿠폰 설명 표시
          - grey--text: 텍스트를 회색으로 스타일링
        -->
        <v-card-subtitle class="text-body-2 grey--text">
          {{ coupon.couponDescription }}
        </v-card-subtitle>

        <!-- 
          쿠폰 상세 정보 표시
          - 최소 주문 금액
          - 할인 정보
          - 만료일 또는 사용 가능 기간
        -->
        <v-card-text>
          최소 주문 금액: {{ formatPrice(coupon.minimumPrice) }} <br />
          {{ discountInfo(coupon) }} <br />
          {{ coupon.expiredType === 'FIXED_DATE' 
              ? `만료일: ${formatDate(coupon.expiredAt)}` 
              : `사용 가능 날짜: ${coupon.couponLifetime}` }}
        </v-card-text>

        <!-- 
          삭제 버튼
          - block: 버튼이 부모 요소의 전체 너비를 차지하도록 설정
          - @click: 버튼 클릭 시 부모 컴포넌트로 'deleteCoupon' 이벤트를 전달
        -->
        <v-card-actions>
          <v-btn 
            color="red" 
            block 
            @click="$emit('deleteCoupon', coupon.couponId)"
          >
            삭제하기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import api from '../../api/axios'; // API 요청을 위한 Axios 모듈

// 부모 컴포넌트에서 전달받는 props 정의
const props = defineProps({
  coupons: { type: Array, required: true }, // 쿠폰 목록 데이터 배열
});

// 부모 컴포넌트로 전달할 이벤트 정의
const emit = defineEmits(['deleteCoupon', 'statusUpdated']); // 쿠폰 삭제 및 상태 변경 이벤트

// 가격 포맷 함수
// 숫자를 "1,000원" 형식으로 변환
const formatPrice = (price) => `${price.toLocaleString()}원`;

// 날짜 포맷 함수
// 날짜를 "YYYY.MM.DD" 형식으로 변환
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// 할인 정보 생성 함수
// 쿠폰이 퍼센트 할인인지 금액 할인인지에 따라 표시 내용을 생성
const discountInfo = (coupon) => {
  if (coupon.discountType === 'PERCENTAGE') {
    return `할인율: ${coupon.fixedRate}% (최대 할인: ${formatPrice(coupon.maxDiscountAmount)})`;
  } else if (coupon.discountType === 'FIXED_AMOUNT') {
    return `할인 금액: ${formatPrice(coupon.fixedAmount)}`;
  }
  return ''; // 할인 정보가 없으면 빈 문자열 반환
};

// 쿠폰 상태 토글 함수
// 사용자가 토글 버튼을 클릭하면 호출됨
const toggleCouponStatus = async (coupon, newValue) => {
  const newStatus = newValue ? 'ACTIVE' : 'INACTIVE'; // 새로운 상태 계산
  console.log(`토글 상태 변경 요청: ${coupon.couponId}, 새로운 상태: ${newStatus}`);

  try {
    // 서버에 상태 변경 요청 전송
    const response = await api.put(`/users/admin/coupons/${coupon.couponId}/status`, null, {
      params: { couponStatus: newStatus },
    });
    console.log('서버 응답 데이터:', response.data);

    // 서버 응답 데이터를 기반으로 쿠폰 상태 업데이트
    coupon.couponStatus = response.data.couponStatus || newStatus;
    emit('statusUpdated', {
      couponId: coupon.couponId,
      couponStatus: coupon.couponStatus,
    });
  } catch (error) {
    console.error('쿠폰 상태 변경 실패:', error.response?.data || error.message);
    alert('쿠폰 상태를 변경하는 중 문제가 발생했습니다.');

    // 에러 발생 시 이전 상태로 복원
    coupon.couponStatus = newValue ? 'INACTIVE' : 'ACTIVE';
  }
};
</script>
