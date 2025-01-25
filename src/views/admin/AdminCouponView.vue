<template>
  <v-app>
    <admin-navigation-bar />

    <v-main>
    <v-container>
      <!-- 상단 탭 -->
      <v-row>
        <v-tabs v-model="currentTab" fixed-tabs>
          <v-tab @click="filterCoupons('ALL')">전체</v-tab>
          <v-tab @click="filterCoupons('ACTIVE')">활성화</v-tab>
          <v-tab @click="filterCoupons('INACTIVE')">비활성화</v-tab>
        </v-tabs>
      </v-row>

      <!-- 쿠폰 목록 Form -->
      <admin-coupon-form :coupons="filteredCoupons" @deleteCoupon="deleteCoupon" />

      <!-- 하단 쿠폰 등록하기 버튼 -->
      <v-row justify="center" class="mt-6">
        <v-btn color="green" block @click="goToRegisterCoupon">
          쿠폰 등록하기
        </v-btn>
      </v-row>
    </v-container>
  </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api/axios';
import AdminNavigationBar from './AdminNavigationBar.vue';
import AdminCouponForm from '../../components/admin/AdminCouponForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const coupons = ref([]);
const filteredCoupons = ref([]);
const currentTab = ref('ALL');

// 쿠폰 목록 조회
const fetchCoupons = async () => {
  try {
    const response = await api.get('/users/admin/coupons');
    coupons.value = response.data.couponList;
    filteredCoupons.value = coupons.value;
  } catch (error) {
    console.error('쿠폰 조회 실패:', error.response?.data || error.message);
    alert('쿠폰 목록을 불러오는 데 실패했습니다.');
  }
};

// 탭 필터링
const filterCoupons = (status) => {
  if (status === 'ALL') {
    filteredCoupons.value = coupons.value;
  } else {
    filteredCoupons.value = coupons.value.filter(
      (coupon) => coupon.couponStatus === status
    );
  }
};

// 쿠폰 삭제 요청
const deleteCoupon = async (couponId) => {
  try {
    await api.delete(`/users/admin/coupons/${couponId}`);
    alert('쿠폰이 성공적으로 삭제되었습니다.');
    fetchCoupons();
  } catch (error) {
    console.error('쿠폰 삭제 실패:', error.response?.data || error.message);
    alert('쿠폰 삭제에 실패했습니다.');
  }
};

// 쿠폰 등록 페이지 이동
const goToRegisterCoupon = () => {
  router.push('/admin/coupon/register');
};

onMounted(fetchCoupons);
</script>
