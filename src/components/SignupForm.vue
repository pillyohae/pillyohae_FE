<template>
    <v-form @submit.prevent="handleSignUp">
        <!-- 이름 입력 -->
        <v-text-field v-model="name" label="이름" required />
        <!-- 이메일 입력 -->
        <v-text-field v-model="email" label="이메일" type="email" required />

        <!-- 핸드폰 번호 입력 -->
        <v-text-field v-model="phoneNumber" label="핸드폰 번호" type="tel" required placeholder="010-1234-5678" />

        <!-- 우편번호 입력 -->
        <v-layout align-center>
            <v-text-field v-model="postcode" label="우편번호" readonly class="mr-2" required />
            <v-btn color="blue" dark @click="openAddressSearch">
                우편번호 찾기
            </v-btn>
        </v-layout>

        <!-- 도로명 주소 입력 -->
        <v-text-field v-model="roadAddress" label="도로명 주소" readonly required />
        <!-- 지번 주소 입력 -->
        <v-text-field v-model="jibunAddress" label="지번 주소" readonly required />
        <!-- 상세 주소 입력 -->
        <v-text-field v-model="detailAddress" label="상세 주소" required />
        <!-- 참고 항목 입력 -->
        <v-text-field v-model="extraAddress" label="참고 항목" readonly />

        <!-- 비밀번호 입력 -->
        <v-text-field v-model="password" label="비밀번호" type="password" required />
        <!-- 비밀번호 확인 -->
        <v-text-field v-model="confirmPassword" label="비밀번호 확인" type="password" required />

        <!-- 역할 선택 (구매자 or 판매자) -->
        <v-radio-group v-model="role" row>
            <v-radio label="구매자" value="BUYER"></v-radio>
            <v-radio label="판매자" value="SELLER"></v-radio>
        </v-radio-group>

        <!-- 회원가입 버튼 -->
        <v-btn type="submit" color="green" block class="mt-4">회원가입</v-btn>
    </v-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['handleSignup']);

// 사용자 입력 데이터를 관리하는 ref 선언
const name = ref('');
const email = ref('');
const phoneNumber = ref('');
const postcode = ref('');
const roadAddress = ref('');
const jibunAddress = ref('');
const detailAddress = ref('');
const extraAddress = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('BUYER'); // 기본값: 구매자

// 폼 제출 시 호출되는 메서드
const handleSignUp = () => {
    // 비밀번호와 확인 값이 일치하는지 검증
    if (password.value !== confirmPassword.value) {
        alert('비밀번호 확인과 비밀번호가 일치하지 않습니다');
        return;
    }

    // 역할이 선택되지 않았을 때 알림
    if (!role.value) {
        alert('가입 유형을 선택해주세요!');
        return;
    }

    // 부모 컴포넌트로 데이터 전달
    const userInfo = {
        name: name.value,
        email: email.value,
        phoneNumber: phoneNumber.value,
        postcode: postcode.value,
        roadAddress: roadAddress.value,
        detailAddress: detailAddress.value,
        password: password.value,
        role: role.value,
    };
    emit('handleSignup', userInfo); // signup 이벤트 발생
};

// 카카오 주소 검색 API 호출
const openAddressSearch = () => {
    new daum.Postcode({
        oncomplete: (data) => {
            // 도로명 주소, 지번 주소, 우편번호 설정
            roadAddress.value = data.roadAddress;
            jibunAddress.value = data.jibunAddress;
            postcode.value = data.zonecode;

            // 추가 주소 정보 설정
            let extraRoadAddr = '';
            if (data.bname && /[동|로|가]$/g.test(data.bname)) {
                extraRoadAddr += data.bname;
            }
            if (data.buildingName) {
                extraRoadAddr += extraRoadAddr ? `, ${data.buildingName}` : data.buildingName;
            }
            extraAddress.value = extraRoadAddr ? `(${extraRoadAddr})` : '';
        },
    }).open();
};

// 컴포넌트가 로드되면 카카오 주소 검색 API 스크립트 동적 로드
onMounted(() => {
    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);
});
</script>


<style scoped>
/* 스타일 필요 시 추가 */
</style>
