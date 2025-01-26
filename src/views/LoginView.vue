<template>
    <div class="form-container">
        <!-- 자식 컴포넌트인 LoginForm 에서 emit 으로 login 이벤트를 발생시키면 loginUser 메서드로 처리함을 명시-->
        <LoginForm @login="loginUser" />
    </div>
</template>

<script setup>
import LoginForm from '../components/LoginForm.vue'; // LoginForm 컴포넌트 import
import api from '../api/axios';
import router from "../router";


/**
 * 로그인 처리를 위한 비동기 함수
 * @param {Object} credentials - LoginForm에서 전달받은 사용자 로그인 정보
 */
const loginUser = async (credentials) => {
    try {
        // 로그인 API 호출 및 서버 응답 대기
        const response = await api.post('/users/login', credentials);

        // 응답 헤더에서 JWT 토큰 가져오기
        const token = response.headers.authorization;

        // JWT 토큰의 payload 디코딩
        const payload = JSON.parse(atob(token.split('.')[1]));

        // 토큰과 사용자 정보가 존재하면 처리
        if (token && payload) {
            // 로컬 스토리지에 토큰 저장
            localStorage.setItem('accessToken', token);
            console.log('로그인 성공 : ', token);
            alert('로그인 성공!');

            // 사용자 역할에 따른 페이지 이동 처리
            if (payload.role === 'SELLER') {
                router.push('/seller'); // 판매자 페이지로 이동
            } else if (payload.role === 'BUYER') {
                router.push('/buyer'); // 구매자 페이지로 이동
            } else if (payload.role === 'ADMIN') {
                router.push('/admin'); //관리자 페이지로 이동
            } else {
                alert('알 수 없는 사용자 권한입니다.');
            }
        } else {
            console.error('Authorization 헤더에 토큰이 없습니다.');
        }
    } catch (error) {
        // 로그인 실패 시 처리
        console.error('로그인 실패 : ', error.response?.data || error.message);
        alert('로그인 실패. 다시 시도해주세요!');
    }
};
</script>


<style>
</style>