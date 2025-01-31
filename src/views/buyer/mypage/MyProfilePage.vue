<template>
  <v-container>
    <!-- 
      상단 네비게이션 바
      - 뒤로 가기 버튼
      - 페이지 제목
      - 수정 모드 토글 버튼
    -->
    <v-row align-center justify="space-between" class="mb-4">
      <!-- 뒤로 가기 버튼 -->
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-card-title>회원 정보</v-card-title>
      <!-- 수정 모드 토글 버튼 -->
      <v-btn text color="primary" @click="toggleEditMode">
        {{ isEditMode ? '수정 취소' : '수정하기' }}
      </v-btn>
    </v-row>

    <!-- 
      사용자 정보 표시/수정 폼 
      - userInfo: 사용자 정보 전달
      - isEditMode: 수정 가능 여부 전달
      - saveChanges 이벤트를 통해 변경 사항 저장
    -->
    <v-card class="my-4">
      <my-profile-form
        :userInfo="userInfo"
        :isEditMode="isEditMode"
        @saveChanges="saveChanges"
      />
    </v-card>

    <!-- 회원 탈퇴 버튼 -->
    <v-row justify="end">
      <v-btn color="red" outlined @click="openDialog">회원탈퇴</v-btn>
    </v-row>

    <!-- 
      회원 탈퇴 확인 다이얼로그 
      - 사용자가 비밀번호 입력 후 탈퇴 가능
    -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>탈퇴를 원하시면 기존 비밀번호를 입력해주세요</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="password"
            label="기존 비밀번호"
            type="password"
            required
          />
        </v-card-text>
        <v-card-actions>
          <!-- 취소 버튼 -->
          <v-btn color="red" text @click="closeDialog">취소</v-btn>
          <!-- 회원 탈퇴 버튼 -->
          <v-btn color="green" block @click="deleteAccount">회원탈퇴</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import MyProfileForm from '../../../components/buyer/mypage/MyProfileForm.vue';
import api from '../../../api/axios';

// 반응형 객체: 사용자 정보 저장
const userInfo = reactive({
  name: '',
  email: '',
  phoneNumber: '',
  postCode: '',
  roadAddress: '',
  detailAddress: '',
  password: '',
});

// 수정 모드 여부
const isEditMode = ref(false);

// 회원 탈퇴 다이얼로그 상태
const dialog = ref(false);

// 회원 탈퇴 시 입력할 비밀번호
const password = ref('');

// 사용자 프로필 데이터 가져오기
const fetchUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    const profile = response.data;

    // 사용자 정보 저장
    userInfo.name = profile.name || '정보 없음';
    userInfo.email = profile.email || '정보 없음';
    userInfo.phoneNumber = profile.address?.phoneNumber || '정보 없음';
    userInfo.postCode = profile.address?.postCode || '정보 없음';
    userInfo.roadAddress = profile.address?.roadAddress || '정보 없음';
    userInfo.detailAddress = profile.address?.detailAddress || '정보 없음';
  } catch (error) {
    console.error('사용자 정보 불러오기 실패:', error.response?.data || error.message);
    alert('사용자 정보를 가져올 수 없습니다.');
  }
};

// 수정 모드 토글
const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
};

// 사용자 정보 저장 (수정된 데이터 서버로 전송)
const saveChanges = async (updatedInfo) => {
  try {
    await api.put('/users/profile', updatedInfo);
    alert('정보가 성공적으로 수정되었습니다.');
    fetchUserProfile(); // 수정 후 최신 데이터 다시 불러오기
    isEditMode.value = false; // 수정 모드 종료
  } catch (error) {
    console.error('정보 수정 실패:', error.response?.data || error.message);
    alert('정보 수정에 실패했습니다.');
  }
};

// 회원 탈퇴 다이얼로그 열기
const openDialog = () => {
  dialog.value = true;
};

// 회원 탈퇴 다이얼로그 닫기
const closeDialog = () => {
  dialog.value = false;
  password.value = ''; // 비밀번호 초기화
};

// 회원 탈퇴 요청
const deleteAccount = async () => {
  if (!password.value) {
    alert('비밀번호를 입력해주세요.');
    return;
  }
  try {
    await api.delete('/users', {
      data: { password: password.value }, // 서버로 비밀번호 전달하여 탈퇴 요청
    });
    alert('회원탈퇴가 완료되었습니다.');
    window.location.href = '/login'; // 로그아웃 후 로그인 페이지로 이동
  } catch (error) {
    console.error('회원탈퇴 실패:', error.response?.data || error.message);
    alert('회원탈퇴에 실패했습니다.');
  }
};

// 페이지가 로드되면 사용자 정보 불러오기
onMounted(() => {
  fetchUserProfile();
});
</script>
