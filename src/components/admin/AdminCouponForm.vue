<template>
  <v-row>
    <v-col cols="12" md="6" lg="4" v-for="coupon in coupons" :key="coupon.couponId">
      <v-card outlined>
        <!-- 카드 제목 -->
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6">{{ coupon.couponName }}</span>
          <!-- 토글 버튼 -->
          <v-switch
            :model-value="coupon.couponStatus === 'ACTIVE'"
            :color="coupon.couponStatus === 'ACTIVE' ? 'green' : 'grey'"
            @update:model-value="(newValue) => toggleCouponStatus(coupon, newValue)"
            hide-details
            inset
          />
        </v-card-title>
        <!-- 카드 부제목 -->
        <v-card-subtitle class="text-body-2 grey--text">{{ coupon.couponDescription }}</v-card-subtitle>
        <!-- 카드 본문 -->
        <v-card-text>
          최소 주문 금액: {{ formatPrice(coupon.minimumPrice) }} <br />
          {{ discountInfo(coupon) }} <br />
          {{ coupon.expiredType === 'FIXED_DATE' ? `만료일: ${formatDate(coupon.expiredAt)}` : `사용 가능 날짜: ${coupon.couponLifetime}` }}
        </v-card-text>
        <!-- 삭제 버튼 -->
        <v-card-actions>
          <v-btn color="red" block @click="$emit('deleteCoupon', coupon.couponId)">
            삭제하기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import api from '../../api/axios';

const props = defineProps({
  coupons: { type: Array, required: true },
});

const emit = defineEmits(['deleteCoupon', 'statusUpdated']);

const formatPrice = (price) => `${price.toLocaleString()}원`;

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const discountInfo = (coupon) => {
  if (coupon.discountType === 'PERCENTAGE') {
    return `할인율: ${coupon.fixedRate}% (최대 할인: ${formatPrice(coupon.maxDiscountAmount)})`;
  } else if (coupon.discountType === 'FIXED_AMOUNT') {
    return `할인 금액: ${formatPrice(coupon.fixedAmount)}`;
  }
  return '';
};

const toggleCouponStatus = async (coupon, newValue) => {
  const newStatus = newValue ? 'ACTIVE' : 'INACTIVE';
  console.log(`토글 상태 변경 요청: ${coupon.couponId}, 새로운 상태: ${newStatus}`);

  try {
    const response = await api.put(`/users/admin/coupons/${coupon.couponId}/status`, null, {
      params: { couponStatus: newStatus },
    });
    console.log('서버 응답 데이터:', response.data);

    // 응답 데이터에 따라 상태 업데이트
    coupon.couponStatus = response.data.couponStatus || newStatus; // 서버 응답이 없을 경우 로컬 상태 사용
    emit('statusUpdated', {
      couponId: coupon.couponId,
      couponStatus: coupon.couponStatus,
    });
  } catch (error) {
    console.error('쿠폰 상태 변경 실패:', error.response?.data || error.message);
    alert('쿠폰 상태를 변경하는 중 문제가 발생했습니다.');

    // 에러 발생 시 이전 상태로 되돌림
    coupon.couponStatus = newValue ? 'INACTIVE' : 'ACTIVE';
  }
};

</script>