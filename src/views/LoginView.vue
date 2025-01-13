<template>
    <div>
        <h2>로그인</h2>
        <!-- 자식 컴포넌트인 LoginForm 에서 this.$emit 으로 발생한 이벤트를 받아와 메서드로 처리함을 명시-->
        <LoginForm @login="loginUser" />
    </div>
</template>

<script>
import LoginForm from '../components/LoginForm.vue';
import axios from '../api/axios';

export default {
    components: { LoginForm },
    methods: {
        //자식컴포넌트가 보낸 데이터를 credentials 로 받아옴. 다른 이름이어도 됨.
        //async는 비동기 함수를 만들어줌. Promise 객체를 반환하며 내부에서 비동기 작업을 처리 가능하게 됨
        async loginUser(credentials) {
            try {
                //await 는 Promise 객체가 처리될 때까지 기다렸다가 결과를 반환함, 서버가 응답을 반환할 때까지 기다림
                //반드시 async 가 붙은 비동기 함수 내에서만 사용할 수 있음
                const response = await axios.post('/users/login', credentials);

                // 서버의 응답인 JWT 토큰을 헤더에서 가져옴
                const token = response.headers.authorization;

                // 토큰에서 정보 추출을 위해 디코딩
                // 토큰의 정보가 담긴 가운데부분 payload 를 디코딩
                const payload = JSON.parse(atob(token.split(".")[1]));

                // 토큰과 사용자 정보가 있다면 실행
                if (token && payload) {
                    //로컬 스토리지에 토큰을 저장
                    localStorage.setItem('accessToken', token);
                    console.log('로그인 성공 : ', token);
                    alert('로그인 성공!');

                    //payload 에 담긴 사용자의 역할에 따라 화면 이동을 다르게 함
                    if (payload.role === 'SELLER') {
                        this.$router.push('/seller') //판매자 메인으로 이동
                    } else if (payload.role === 'BUYER') {
                        this.$router.push('/buyer'); //구매자 메인으로 이동
                    } else {
                        alert('알 수 없는 사용자 권한입니다.');
                    }
                } else {
                    console.error('Authorization 헤더에 토큰이 없습니다.');
                }
            } catch (error) {
                //로그인 요청이 실패했을 때 실행
                console.error('로그인 실패 : ', error.response?.data || error.message);
                alert('로그인 실패. 다시 시도해주세요!');
            }
        },
    }
}
</script>

<style></style>