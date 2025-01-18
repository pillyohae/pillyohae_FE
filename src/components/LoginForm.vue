<template>
    <v-form @submit.prevent="handleLogin">

        <v-text-field v-model.trim="email" label="이메일" type="email" required />

        <v-text-field v-model.trim="password" label="패스워드" type="password" required />

        <v-btn type="submit" color="green" block class="mt-4">로그인</v-btn>

        <!-- 회원가입으로 이동하는 버튼 -->
        <v-btn type="button" color="green" block class="mt-4" @click="goTosignUp">회원가입</v-btn>
    </v-form>
</template>

<script setup>
import { ref } from 'vue';
import router from "../router";;
import { defineEmits } from 'vue';

const email = ref('');
const password = ref('');

const handleLogin = () => {

    emit('login', { email: email.value, password: password.value });
}

const goTosignUp = () => {
    router.push('/signup');
}

const emit = defineEmits(['login']);
</script>

<style></style>