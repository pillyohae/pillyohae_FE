<template>
    <v-card-text>
        <!-- 이름 -->
        <v-text-field v-model="localUserInfo.name" label="이름" :readonly="!isEditMode" />
        <!-- 이메일 -->
        <v-text-field v-model="localUserInfo.email" label="이메일" readonly />
        <!-- 주소 -->
        <v-layout align-center>
            <v-text-field v-model="localUserInfo.postCode" label="우편 번호" :readonly="!isEditMode" />
            <v-btn v-if="isEditMode" color="blue" dark @click="openAddressSearch">주소 검색</v-btn>
        </v-layout>

        <!-- 도로명 주소 입력 -->
        <v-text-field v-model="localUserInfo.roadAddress" label="도로명 주소" readonly required />

        <!-- 상세 주소 입력 -->
        <v-text-field v-model="localUserInfo.detailAddress" label="상세 주소" required />


        <!-- 전화번호 -->
        <v-text-field v-model="localUserInfo.phoneNumber" label="휴대폰 번호" :readonly="!isEditMode" />
        <!-- 기존 비밀번호 -->
        <v-text-field v-model="localUserInfo.password" label="기존 비밀번호" type="password" :readonly="!isEditMode" />
        <!-- 새 비밀번호 -->
        <v-text-field v-if="isEditMode" v-model="localUserInfo.newPassword" label="새 비밀번호" type="password" />
        <!-- 저장 버튼 -->
        <v-btn v-if="isEditMode" color="blue" @click="saveChanges">저장하기</v-btn>
    </v-card-text>
</template>

<script setup>
import { reactive, watchEffect, defineProps, defineEmits, onMounted } from 'vue';

const props = defineProps({
    userInfo: {
        type: Object,
        required: true,
    },
    isEditMode: {
        type: Boolean,
        required: true,
    },
});

const emit = defineEmits(['saveChanges']);

const localUserInfo = reactive({});

// 비동기 데이터 반영
watchEffect(() => {
    Object.assign(localUserInfo, props.userInfo);
});

// 변경된 필드만 추적하는 함수
const getUpdatedFields = () => {
  const updatedFields = {};
  if (localUserInfo.name !== props.userInfo.name) {
    updatedFields.newName = localUserInfo.name;
    updatedFields.newAddress = updatedFields.newAddress || {};
    updatedFields.newAddress.receiverName = localUserInfo.name;
  }
  if (localUserInfo.phoneNumber !== props.userInfo.phoneNumber) {
    updatedFields.newAddress = updatedFields.newAddress || {};
    updatedFields.newAddress.phoneNumber = localUserInfo.phoneNumber;
  }
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
  if (localUserInfo.newPassword) {
    updatedFields.newPassword = localUserInfo.newPassword;
  }
  return updatedFields;
};


const saveChanges = () => {
    const updatedFields = getUpdatedFields();
    if (localUserInfo.password) {
        updatedFields.password = localUserInfo.password;
        emit('saveChanges', updatedFields);
    } else {
        alert('기존 비밀번호는 필수 입력 사항입니다.');
    }
    
};

const openAddressSearch = () => {
    new daum.Postcode({
        oncomplete: (data) => {
            // 도로명 주소, 지번 주소, 우편번호 설정
            localUserInfo.roadAddress = data.roadAddress;
            localUserInfo.postCode = data.zonecode;
        },
    }).open();
};

onMounted(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

});


</script>