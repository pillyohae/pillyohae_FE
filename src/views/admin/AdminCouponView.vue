<template>
  <v-app>
    <admin-navigation-bar />

    <v-main>
      <v-container>
        <!-- 탭 메뉴: 전체, 활성화, 비활성화 -->
        <v-row>
          <v-tabs v-model="currentTab" fixed-tabs>
            <v-tab value="ALL">전체</v-tab>
            <v-tab value="ACTIVE">활성화</v-tab>
            <v-tab value="INACTIVE">비활성화</v-tab>
          </v-tabs>
        </v-row>

        <!-- 쿠폰 목록 컴포넌트 -->
        <admin-coupon-form
          :coupons="filteredCoupons" 
          @deleteCoupon="deleteCoupon" 
          @statusUpdated="updateCouponStatus" 
        />

        <!-- 쿠폰 등록 버튼 -->
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
import { ref, computed, onMounted } from 'vue';
import api from '../../api/axios';
import AdminNavigationBar from './AdminNavigationBar.vue';
import AdminCouponForm from '../../components/admin/AdminCouponForm.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const coupons = ref([]);
const currentTab = ref('ALL');

const fetchCoupons = async () => {
  try {
    const response = await api.get('/users/admin/coupons');
    coupons.value = response.data.couponList; // 그대로 사용
  } catch (error) {
    console.error('쿠폰 목록 조회 실패:', error.response?.data || error.message);
    alert('쿠폰 목록을 불러오는 데 실패했습니다.');
  }
};

const filteredCoupons = computed(() => {
  if (currentTab.value === 'ALL') return coupons.value;
  return coupons.value.filter((coupon) => coupon.couponStatus === currentTab.value);
});

const updateCouponStatus = ({ couponId, couponStatus }) => {
  const index = coupons.value.findIndex((c) => c.couponId === couponId);
  if (index !== -1) {
    coupons.value[index].couponStatus = couponStatus;
    coupons.value = [...coupons.value]; // 배열 재할당으로 반응성 강제 트리거
  }
};


const deleteCoupon = async (couponId) => {
  try {
    await api.delete(`/users/admin/coupons/${couponId}`);
    alert('쿠폰이 삭제되었습니다.');
    fetchCoupons();
  } catch (error) {
    console.error('쿠폰 삭제 실패:', error.response?.data || error.message);
    alert('쿠폰 삭제에 실패했습니다.');
  }
};

const goToRegisterCoupon = () => {
  router.push('/admin/coupon/register');
};

onMounted(fetchCoupons);
</script>

