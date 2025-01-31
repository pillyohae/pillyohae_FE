<template>
  <v-card-text>
    <!-- 이름 입력 필드 -->
    <!-- 읽기 전용 모드일 경우 수정 불가 -->
    <v-text-field v-model="localUserInfo.name" label="이름" :readonly="!isEditMode" />

    <!-- 이메일 입력 필드 (항상 읽기 전용) -->
    <v-text-field v-model="localUserInfo.email" label="이메일" readonly />

    <!-- 주소 입력 영역 -->
    <v-layout align-center>
      <!-- 우편번호 입력 필드 -->
      <v-text-field v-model="localUserInfo.postCode" label="우편 번호" :readonly="!isEditMode" />
      <!-- 주소 검색 버튼 (편집 모드에서만 활성화) -->
      <v-btn v-if="isEditMode" color="blue" dark @click="openAddressSearch">주소 검색</v-btn>
    </v-layout>

    <!-- 도로명 주소 입력 필드 (항상 읽기 전용) -->
    <v-text-field v-model="localUserInfo.roadAddress" label="도로명 주소" readonly required />

    <!-- 상세 주소 입력 필드 -->
    <v-text-field v-model="localUserInfo.detailAddress" label="상세 주소" required />

    <!-- 휴대폰 번호 입력 필드 -->
    <!-- 읽기 전용 모드일 경우 수정 불가 -->
    <v-text-field v-model="localUserInfo.phoneNumber" label="휴대폰 번호" :readonly="!isEditMode" />

    <!-- 기존 비밀번호 입력 필드 (필수 입력) -->
    <v-text-field v-model="localUserInfo.password" label="기존 비밀번호" type="password" :readonly="!isEditMode" />

    <!-- 새 비밀번호 입력 필드 (편집 모드에서만 표시) -->
    <v-text-field v-if="isEditMode" v-model="localUserInfo.newPassword" label="새 비밀번호" type="password" />

    <!-- 저장 버튼 (편집 모드에서만 표시) -->
    <v-btn v-if="isEditMode" color="blue" @click="saveChanges">저장하기</v-btn>
  </v-card-text>
</template>

<script setup>
import { reactive, watchEffect, defineProps, defineEmits, onMounted } from 'vue';

// 부모 컴포넌트에서 전달받는 props 정의
const props = defineProps({
  userInfo: {
    type: Object, // 사용자 정보 객체
    required: true, // 필수 값
  },
  isEditMode: {
    type: Boolean, // 편집 모드 여부
    required: true, // 필수 값
  },
});

// 부모 컴포넌트로 이벤트 전달 설정
const emit = defineEmits(['saveChanges']);

// 반응형 사용자 정보 객체 (localUserInfo)
// - props의 userInfo 데이터를 로컬에서 관리
const localUserInfo = reactive({});

// props 변경 시 반영
watchEffect(() => {
  Object.assign(localUserInfo, props.userInfo);
});

// 변경된 필드만 추적하여 반환하는 함수
const getUpdatedFields = () => {
  const updatedFields = {};
  
  // 이름이 변경된 경우
  if (localUserInfo.name !== props.userInfo.name) {
    updatedFields.newName = localUserInfo.name;
    updatedFields.newAddress = updatedFields.newAddress || {};
    updatedFields.newAddress.receiverName = localUserInfo.name;
  }

  // 휴대폰 번호가 변경된 경우
  if (localUserInfo.phoneNumber !== props.userInfo.phoneNumber) {
    updatedFields.newAddress = updatedFields.newAddress || {};
    updatedFields.newAddress.phoneNumber = localUserInfo.phoneNumber;
  }

  // 주소 정보가 변경된 경우
  if (localUserInfo.postCode !== props.userInfo.postCode) {
    updatedFields.newAddress = updatedFields.newAddress || {};
    updatedFields.newAddress.postCode = localUserInfo.postCode;
  }
  if (localUserInfo.roadAddress !== props.userInfo.roadAddress) {
    updatedFields.newAddress = updatedFields.newAddress || {};
    updatedFields.newAddress.roadAddress = localUserInfo.roadAddress;
  }
  if (localUserInfo.detailAddress !== props.userInfo.detailAddress) {
    updatedFields.newAddress = updatedFields.newAddress || {};
    updatedFields.newAddress.detailAddress = localUserInfo.detailAddress;
  }

  // 새 비밀번호가 입력된 경우
  if (localUserInfo.newPassword) {
    updatedFields.newPassword = localUserInfo.newPassword;
  }

  return updatedFields;
};

// 변경 사항 저장 함수
const saveChanges = () => {
  const updatedFields = getUpdatedFields();

  // 기존 비밀번호 입력 여부 확인
  if (localUserInfo.password) {
    updatedFields.password = localUserInfo.password;
    emit('saveChanges', updatedFields); // 부모 컴포넌트로 변경된 데이터 전달
  } else {
    alert('기존 비밀번호는 필수 입력 사항입니다.'); // 비밀번호 미입력 시 경고
  }
};

// 주소 검색 기능 (다음 주소 API 사용)
const openAddressSearch = () => {
  new daum.Postcode({
    oncomplete: (data) => {
      // 도로명 주소, 우편번호 설정
      localUserInfo.roadAddress = data.roadAddress;
      localUserInfo.postCode = data.zonecode;
    },
  }).open();
};

// 주소 검색 API 스크립트 추가 (다음 API)
onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  script.async = true;
  document.head.appendChild(script);
});
</script>
