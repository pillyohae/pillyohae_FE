<template>
    <div>
        <h2>회원가입</h2>
        <!-- SignupForm 컴포넌트에서 데이터를 받아옴-->
        <SignupForm @signup="SignupUser" />
    </div>
</template>

<script>
import SignupForm from '../components/SignupForm.vue';
import axios from '../api/axios';

export default {
    components: { SignupForm },
    methods: {
        // 회원가입 정보를 서버로 전송하는 함수
        async SignupUser(userInfo) {
            try {
                // 서버에 POST 요청을 보내 회원가입 데이터를 전달합니다.
                const response = await axios.post('/users/signup', userInfo);

                // 서버에서 회원가입 성공 메시지를 받으면 실행됩니다.
                console.log('회원가입 성공:', response.data);
                alert('회원가입 성공!'); // 성공 메시지를 사용자에게 보여줍니다.

                // 회원가입이 완료되면 로그인 화면으로 이동합니다.
                this.$router.push('/login');
            } catch (error) {
                // 회원가입이 실패했을 경우 실행됩니다.
                console.error(
                    '회원가입 실패:',
                    error.response?.data || error.message
                );
                alert('회원가입 실패. 다시 시도해주세요.'); // 실패 메시지를 사용자에게 보여줍니다.
            }
        },
    },
};
</script>

<style></style>