<template>
    <!-- 로그인 양식 Vuetify 에서 제공하는 컴포넌트로 구현 
   @ 는 Vue 의 이벤트 바인딩, @submit 은 submit 이벤트가 발생할 때 실행할 함수를 바인딩
   .prevent는 Vue 의 이벤트 수식어로 기본동작을 방지, form 태그가 데이터를 전송할 때
   submit 을 호출하고 페이지를 새로고침하는데 그것을 Vue에서만 handleLogind으로 동작하도록 막음-->
    <v-form @submit.prevent="handleLogin">
        <!-- 이메일 입력 텍스트 필드 v-model 은 HTML 폼 요소값과 Vue 컴포넌트 데이터를 연결
     v-model 의 email 은 컴포넌트의 data() 에 정의된 변수. 사용자가 입력필드에 값을 입력하면
     data()의 email 변수에 해당 값이 저장됨-->
        <v-text-field v-model.trim="email" label="이메일" type="email" required />

        <!-- 패스워드 입력 텍스트 필드-->
        <v-text-field v-model.trim="password" label="패스워드" type="password" required />

        <!-- 로그인 버튼 button 태그의 속성을 submit 으로 두면 폼 제출 버튼을 의미
     form 태그의 데이터를 서버 or 부모 컴포넌트에 전달, 클릭 시 submit 이벤트가 발생함.
      block과 class 는 css 요소-->
        <v-btn type="submit" color="green" block class="mt-4">로그인</v-btn>

        <!-- 회원가입으로 이동하는 버튼 -->
        <v-btn type="button" color="green" block class="mt-4" @click="goTosignUp">회원가입</v-btn>
    </v-form>
</template>

<script>

//JS 에서 모듈을 내보낼 때 사용하는 문법 export default, Vue 파일에서 컴포넌트의 설정 객체를 내보냄
//내보낼 수 있는 정보 : 데이터, 메서드, 라이프 사이클 훅 등을 정의
//해당 Vue 파일을 다른 파일에서 사용할 수 있도록 내보내기 위해서 사용
export default {
    data() {
        return {
            email: '', //사용자가 입력한 이메일
            password: '', //사용자가 입력한 패스워드
        };
    },
    methods: {
        handleLogin() {
            //emit 은 Vue 인스턴스의 메서드, 부모 컴포넌트에 이벤트를 발생시켜 데이터를 전달
            //자식 -> 부모 : emit, 부모 -> 자식 : props
            //첫번째 인자는 이벤트 이름, 두번째 인자는 전달할 데이터.
            this.$emit('login', { email: this.email, password: this.password })
        },
        goTosignUp() {
            this.$router.push('/signup');
        }
    }
}
</script>

<style></style>