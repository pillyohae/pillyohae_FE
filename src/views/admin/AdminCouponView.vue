<template>
  <v-app>
    <!-- 관리자 네비게이션 바 -->
    <admin-navigation-bar />

    <v-main>
      <v-container>
        <!-- 
          탭 메뉴
          - v-model: 선택된 탭 값을 currentTab 변수에 바인딩
          - fixed-tabs: 고정된 너비의 탭 스타일 적용
        -->
        <v-row>
          <v-tabs v-model="currentTab" fixed-tabs>
            <v-tab value="ALL">전체</v-tab> <!-- 전체 쿠폰 탭 -->
            <v-tab value="ACTIVE">활성화</v-tab> <!-- 활성화된 쿠폰 탭 -->
            <v-tab value="INACTIVE">비활성화</v-tab> <!-- 비활성화된 쿠폰 탭 -->
          </v-tabs>
        </v-row>

        <!-- 
          쿠폰 목록 컴포넌트
          - :coupons: 현재 선택된 탭에 따라 필터링된 쿠폰 목록을 전달
          - @deleteCoupon: 쿠폰 삭제 이벤트 처리
          - @statusUpdated: 쿠폰 상태 변경 이벤트 처리
        -->
        <admin-coupon-form
          :coupons="filteredCoupons"
          @deleteCoupon="deleteCoupon"
          @statusUpdated="updateCouponStatus"
        />

        <!-- 
          쿠폰 등록 버튼
          - color: 버튼 색상 설정 (녹색)
          - block: 버튼 너비를 부모 요소에 맞춤
          - @click: 버튼 클릭 시 쿠폰 등록 페이지로 이동
        -->
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
import { ref, computed, onMounted } from 'vue'; // Vue Composition API 사용
import api from '../../api/axios'; // API 요청을 위한 Axios 모듈
import AdminNavigationBar from './AdminNavigationBar.vue'; // 관리자 네비게이션 바 컴포넌트
import AdminCouponForm from '../../components/admin/AdminCouponForm.vue'; // 쿠폰 목록 컴포넌트
import { useRouter } from 'vue-router'; // 페이지 이동을 위한 Vue Router

const router = useRouter(); // Vue Router 인스턴스 생성

// 쿠폰 목록 데이터
const coupons = ref([]); // 서버에서 가져온 쿠폰 데이터를 저장
const currentTab = ref('ALL'); // 현재 선택된 탭 ('ALL', 'ACTIVE', 'INACTIVE')

// 서버에서 쿠폰 목록 데이터를 가져오는 함수
const fetchCoupons = async () => {
  try {
    const response = await api.get('/users/admin/coupons'); // 쿠폰 목록 API 요청
    coupons.value = response.data.couponList; // 응답 데이터에서 쿠폰 목록 저장
  } catch (error) {
    console.error('쿠폰 목록 조회 실패:', error.response?.data || error.message);
    alert('쿠폰 목록을 불러오는 데 실패했습니다.');
  }
};

// 현재 선택된 탭에 따라 쿠폰 목록을 필터링하는 계산 속성
const filteredCoupons = computed(() => {
  if (currentTab.value === 'ALL') return coupons.value; // '전체' 탭이면 모든 쿠폰 반환
  return coupons.value.filter((coupon) => coupon.couponStatus === currentTab.value); // 상태에 따른 필터링
});

// 쿠폰 상태 업데이트 함수
// - 쿠폰 ID와 새로운 상태를 받아서 상태를 업데이트
const updateCouponStatus = ({ couponId, couponStatus }) => {
  const index = coupons.value.findIndex((c) => c.couponId === couponId); // 변경할 쿠폰 인덱스 찾기
  if (index !== -1) {
    coupons.value[index].couponStatus = couponStatus; // 상태 업데이트
    coupons.value = [...coupons.value]; // 배열 재할당으로 반응성 강제 트리거
  }
};

// 쿠폰 삭제 함수
// - 서버에 삭제 요청을 보내고 성공하면 목록 새로고침
const deleteCoupon = async (couponId) => {
  try {
    await api.delete(`/users/admin/coupons/${couponId}`); // 쿠폰 삭제 API 요청
    alert('쿠폰이 삭제되었습니다.');
    fetchCoupons(); // 삭제 후 목록 새로고침
  } catch (error) {
    console.error('쿠폰 삭제 실패:', error.response?.data || error.message);
    alert('쿠폰 삭제에 실패했습니다.');
  }
};

// 쿠폰 등록 페이지로 이동하는 함수
const goToRegisterCoupon = () => {
  router.push('/admin/coupon/register'); // 쿠폰 등록 페이지로 라우팅
};

// 컴포넌트가 마운트될 때 쿠폰 목록을 가져옴
onMounted(fetchCoupons);
</script>
