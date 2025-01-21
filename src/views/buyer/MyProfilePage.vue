<template>
    <v-container>
      <!-- 상단 네비게이션 -->
      <v-row align-center justify="space-between" class="mb-4">
        <v-btn icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card-title>회원 정보</v-card-title>
        <v-btn text color="primary" @click="toggleEditMode">
          {{ isEditMode ? '수정 취소' : '수정하기' }}
        </v-btn>
      </v-row>
  
      <!-- 사용자 정보 Form -->
      <v-card class="my-4">
        <my-profile-form
          :userInfo="userInfo"
          :isEditMode="isEditMode"
          @saveChanges="saveChanges"
        />
      </v-card>
  
      <!-- 하단 버튼 -->
      <v-row justify="end">
        <v-btn color="red" outlined @click="deleteAccount">회원탈퇴</v-btn>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import MyProfileForm from '../../components/buyer/MyProfileForm.vue';
  import api from '../../api/axios';
  
  const userInfo = reactive({
    name: '',
    email: '',
    phoneNumber: '',
    postCode: '',
    roadAddress: '',
    detailAddress: '',
    password: '',
  });
  
  const isEditMode = ref(false);
  
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      
      const profile = response.data;
  
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
  
  const toggleEditMode = () => {
    isEditMode.value = !isEditMode.value;
  };
  
  const saveChanges = async (updatedInfo) => {
    try {

      await api.put('/users/profile', updatedInfo);
      alert('정보가 성공적으로 수정되었습니다.');
      fetchUserProfile();
      isEditMode.value = false;
    } catch (error) {
      console.error('정보 수정 실패:', error.response?.data || error.message);
      alert('정보 수정에 실패했습니다.');
    }
  };
  
  const deleteAccount = async () => {
    if (confirm('정말 회원탈퇴를 하시겠습니까?')) {
      try {
        await api.delete('/users/profile');
        alert('회원탈퇴가 완료되었습니다.');
        window.location.href = '/login';
      } catch (error) {
        console.error('회원탈퇴 실패:', error.response?.data || error.message);
        alert('회원탈퇴에 실패했습니다.');
      }
    }
  };
  
  onMounted(() => {
    fetchUserProfile();
  });
  </script>
  