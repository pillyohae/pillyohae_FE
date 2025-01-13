// Vue router 를 가져옴
import { createRouter, createWebHistory } from "vue-router";

//페이지를 import 하는 란
import LoginView from "../views/LoginView.vue"; //로그인 페이지
import SignupView from "../views/SignupView.vue"; //회원가입 페이지

//각 경로와 해당 경로에 대해 연결된 컴포넌트(페이지) 를 정의
//이것을 보고 라우터가 페이지 이동을 하는 것
const routes = [
    { path: '/', redirect: '/login' }, //우선 기본 경로를 로그인 페이지로
    { path: '/login', name: 'Login', component: LoginView },
    { path: '/signup', name : 'Signup', component: SignupView},
]

//Vue router 인스턴스 생성
//브라우저의 히스토리 모드 (뒤로가기, 앞으로가기) 사용
const router = createRouter({
    history: createWebHistory(),
    routes, //위에서 정의한 경로들 설정
});

// 설정된 vue router 를 내보내어 사용할 수 있도록함
export default router;