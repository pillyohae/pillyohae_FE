<template>
    <!-- 회원가입 양식 -->
    <v-form @submit.prevent="handleSignUp">
        <!-- 이름 입력 -->
        <v-text-field v-model="name" label="이름" required />
        <!-- 이메일 입력 -->
        <v-text-field v-model="email" label="이메일" type="email" required />
        <!-- 주소 입력 -->
        <v-text-field v-model="address" label="주소" required />
        <!-- 비밀번호 입력 -->
        <v-text-field v-model="password" label="비밀번호" type="password" required />
        <!-- 비밀번호 확인 -->
        <v-text-field v-model="confirmPassword" label="비밀번호 확인" type="password" required />

    <!-- 역할 선택 (구매자 or 판매자) -->
    <v-radio-group v-mode="role" row>
        <v-radio label="구매자" value="BUYER"></v-radio>
        <v-radio label="판매자" value="SELLER"></v-radio>
    </v-radio-group>

    <!-- 회원가입 버튼 -->
    <v-btn type="submit" color="green" block class="mt-4">회원가입</v-btn>
</v-form>
</template>

<script>
export default {
    // 회원가입에 필요한 데이터를 저장하는 공간
    data() {
        return {
            name: '', // 사용자의 이름
            email: '', // 사용자의 이메일 주소
            address: '', // 사용자의 주소
            password: '', // 사용자가 입력한 비밀번호
            confirmPassword: '', // 비밀번호 확인용 입력값
            role: 'BUYER', // 기본값으로 '구매자' 역할 선택
        };
    },

    methods: {
        handleSignUp() {
            if (this.password !== this.confirmPassword) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }

            if (!this.role) {
                alert('가입 유형을 선택해주세요.');
                return;
            }

            this.$emit('signup', {
                name: this.name, // 이름
                email: this.email, // 이메일
                address: this.address, // 주소
                password: this.password, // 비밀번호
                role: this.role, // 역할(구매자/판매자)
            });
        }
    }
}
</script>

<style></style>