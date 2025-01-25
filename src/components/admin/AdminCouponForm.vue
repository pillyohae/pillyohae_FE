<template>
  <v-row>
    <v-col cols="12" md="6" lg="4" v-for="coupon in coupons" :key="coupon.couponId">
      <v-card outlined>
        <v-card-title class="text-h6">{{ coupon.couponName }}</v-card-title>
        <v-card-subtitle class="text-body-2 grey--text">{{ coupon.couponDescription }}</v-card-subtitle>
        <v-card-text>
          최소 주문 금액: {{ formatPrice(coupon.minimumPrice) }} <br />
          {{ discountInfo(coupon) }} <br />
          {{ coupon.expiredType === 'FIXED_DATE' ? `만료일: ${formatDate(coupon.expiredAt)}` : '' }}
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="coupon.couponStatus === 'ACTIVE'"
            color="red"
            block
            @click="$emit('deleteCoupon', coupon.couponId)"
          >
            삭제하기
          </v-btn>
          <v-btn
            v-else
            block
            disabled
          >
            삭제불가
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
const props = defineProps({
  coupons: {
    type: Array,
    required: true,
  },
});

const formatPrice = (price) => {
  return `${price.toLocaleString()}원`;
};

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
</script>
