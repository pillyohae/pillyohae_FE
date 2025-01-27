<template>
    <div class="login-wrapper">
        <!-- 로그인 페이지 전체 배경 및 가운데 정렬 -->
        <div class="login-container">
            <!-- 로그인 컨테이너: 흰색 배경, 라운드 박스 -->

            <div class="text-center">
                <!-- 프로젝트 이름 표시 -->
                <div class="project-name">Pill요해?</div>
            </div>

            <!-- 로그인 폼 -->
            <v-form @submit.prevent="handleLogin">
                <!-- 이메일 입력 필드 -->
                <v-text-field v-model.trim="email" label="이메일" type="email" outlined dense class="input-field"
                    required></v-text-field>

                <!-- 비밀번호 입력 필드 -->
                <v-text-field v-model.trim="password" label="비밀번호" type="password" outlined dense class="input-field"
                    required></v-text-field>

                <!-- 로그인 버튼 -->
                <v-btn type="submit" block color="success" class="login-btn">
                    로그인
                </v-btn>

                <!-- 회원가입 버튼 -->
                <v-btn type="button" block color="success" outlined class="signup-btn" @click="goTosignUp">
                    회원가입
                </v-btn>
            </v-form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"; // Vue의 반응형 상태 관리를 위한 ref 사용
import { useRouter } from "vue-router"; // 화면 이동을 수행할 router 사용
import { defineEmits } from "vue"; // 부모 컴포넌트로 이벤트를 전달하기 위한 defineEmits 사용

// 사용자 입력 데이터 초기화
const email = ref(""); // 이메일 입력 필드 데이터
const password = ref(""); // 비밀번호 입력 필드 데이터

// 생성한 useRouter 메서드를 통해 router 객체 생성
const router = useRouter();

// 부모 컴포넌트로 이벤트 전달을 위해 정의
const emit = defineEmits(["login"]);

// 로그인 버튼 클릭 시 실행되는 함수
const handleLogin = () => {
    // 위에서 정의한 emit 으로 'login' 이벤트를 부모 컴포넌트로 전달하며, 이메일과 비밀번호 데이터를 포함
    emit("login", { email: email.value, password: password.value });
};

// 회원가입 버튼 클릭 시 실행되는 함수
const goTosignUp = () => {
    // 라우터를 통해 회원가입 페이지로 이동
    router.push("/signup");
};
</script>


<style scoped>
/* 로그인 화면의 배경 */
.login-wrapper {
    background-color: #e8e8e8;
    /* 회색빛 배경 */
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

/* 로그인 컨테이너 스타일 */
.login-container {
    background: white;
    padding: 50px;
    border-radius: 20px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    width: 400px;
}

/* 프로젝트 이름 스타일 */
.project-name {
    background: #4caf50;
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    display: inline-block;
    margin-bottom: 40px;
    font-weight: bold;
    font-size: 26px;
}

/* 입력 필드 스타일 */
.input-field {
    margin-bottom: 25px;
}

/* 로그인 버튼 스타일 */
.login-btn {
    background: #4caf50;
    color: white;
    font-weight: bold;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    font-size: 18px;
}

.login-btn:hover {
    background: #45a049;
}

/* 회원가입 버튼 스타일 */
.signup-btn {
    border: 2px solid #4caf50;
    color: #4caf50;
    font-weight: bold;
    border-radius: 8px;
    padding: 15px;
    font-size: 18px;
    transition: all 0.3s;
}

.signup-btn:hover {
    background: #e8f5e9;
}
</style>