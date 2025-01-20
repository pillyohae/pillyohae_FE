<template>
    <v-container>
        <v-card class="my-4">
            <v-card-title>마이페이지</v-card-title>
            <v-card-text>
                <p>이름: {{ userInfo.name }}</p>
                <p>이메일: {{ userInfo.email }}</p>
                <v-btn color="green" to = '/profile'>프로필 보기</v-btn>
            </v-card-text>
        </v-card>

        <v-row>
            <v-col cols="4">
                <v-card outlined class="text-center">
                    <v-card-title>주문내역</v-card-title>
                    <v-card-text>
                        <v-icon color="primary" large>mdi-package</v-icon>
                    </v-card-text>
                    <v-btn color="primary" to="/myOrder">주문 내역</v-btn>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card outlined class="text-center">
                    <v-card-title>쿠폰</v-card-title>
                    <v-card-text>
                        <v-icon color="success" large>mdi-ticket-percent</v-icon>
                    </v-card-text>
                    <v-btn color="success" @click="showCouponDialog = true">쿠폰 확인</v-btn>
                </v-card>
            </v-col>
            <v-col cols="4">
                <v-card outlined class="text-center">
                    <v-card-title>영양제 추천 결과</v-card-title>
                    <v-card-text>
                        <v-icon color="info" large>mdi-pill</v-icon>
                    </v-card-text>
                    <v-btn color="info" to="/myRecommendation">추천 결과 보기</v-btn>
                </v-card>
            </v-col>
        </v-row>

         <!-- 쿠폰 다이얼로그 -->
         <v-dialog v-model="showCouponDialog" max-width="600px">
            <v-card>
                <v-card-title>내 쿠폰 목록</v-card-title>
                <v-card-text>
                    <v-row v-if="coupons.length > 0">
                        <v-col v-for="coupon in coupons" :key="coupon.couponId">
                            <strong>{{ coupon.couponName }}</strong>
                            <p>{{ coupon.couponDescription }}</p>
                            <p v-if="coupon.discountType === 'PERCENTAGE'">
                                {{ coupon.fixedRate }}% (최대 {{ coupon.maxDiscountAmount }}원)
                            </p>
                            <p v-else-if="coupon.discountType === 'FIXED_AMOUNT'">
                                {{ coupon.fixedAmount }}원
                            </p>
                        </v-col>
                    </v-row>
                    <p v-else>사용 가능한 쿠폰이 없습니다.</p>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="red" text @click="showCouponDialog = false">닫기</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>


<script setup>
import { defineProps, ref } from 'vue';

const props = defineProps({
    userInfo: {
        type: Object,
        required: true,
    },

    coupons : {
        type:Array,
        default : () => [],
    },
})

const showCouponDialog = ref(false);

</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>