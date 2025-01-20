<template>
    <div>
        <!-- 회원가입 제목 -->
        <h2>회원가입</h2>
        <!-- SignupForm 컴포넌트 -->
        <!-- 사용자 정보 입력 후 @signup 이벤트를 발생 시 SignupView 로 이벤트가 전달, SignupUser 호출 -->
        <SignupForm @handleSignup="SignupUser" />
    </div>
</template>

<script setup>
// SignupForm 컴포넌트 import
import SignupForm from '../components/SignupForm.vue';
// 설정한 Axios 인스턴스 import
import api from '../api/axios';
import router from "../router";

/**
 * 회원가입 처리 함수
 * @param {Object} userInfo - SignupForm에서 전달된 사용자 정보
 */
const SignupUser = async (userInfo) => {
    try {
        // API 호출로 회원가입 데이터 전송
        const response = await api.post('/users/signup', userInfo);
        console.log('회원가입 성공 : ', response.data); // 응답 데이터 출력
        alert('회원가입 성공'); // 성공 알림
        router.push('/login'); // 로그인 페이지로 이동
    } catch (error) {
        console.error('회원가입 실패 : ', error.response?.data || error.message); // 오류 출력
        alert('회원가입 실패 다시 시도해주세요'); // 실패 알림
    }
};
</script>

<style>
/* 추가 스타일 필요 시 작성 */
</style>