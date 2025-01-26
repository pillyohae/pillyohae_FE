<template>
    <div class="login-wrapper">
        <div class="login-container">
            <div class="text-center">
                <div class="project-name">Pill요해?</div>
            </div>

            <v-form @submit.prevent="handleLogin">
                <v-text-field v-model.trim="email" label="이메일" type="email" outlined dense class="input-field"
                    required></v-text-field>

                <v-text-field v-model.trim="password" label="비밀번호" type="password" outlined dense class="input-field"
                    required></v-text-field>

                <v-btn type="submit" block color="success" class="login-btn">
                    로그인
                </v-btn>

                <v-btn type="button" block color="success" outlined class="signup-btn" @click="goTosignUp">
                    회원가입
                </v-btn>
            </v-form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import router from "../router";
import { defineEmits } from "vue";

const email = ref("");
const password = ref("");

const handleLogin = () => {
    emit("login", { email: email.value, password: password.value });
};

const goTosignUp = () => {
    router.push("/signup");
};

const emit = defineEmits(["login"]);
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
    transition: background 0.3s;
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