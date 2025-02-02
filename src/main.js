//Vue 애플리케이션의 시작점
//여기서 Vue 앱을 생성(=앱을 초기화)하고, 사용하고자 하는 라이브러리(Vuetify, Router 등)를 등록함.
//Vue 애플리케이션의 최초 설정을 담당하며, 프로젝트 전역적으로 적용될 라이브러리(Vuetify, Router)와 관련 설정을 한 곳에서 관리

//Vue 애플리케이션을 생성하는 함수를 vue 에서 가져옴
import { createApp } from 'vue'
import { createPinia } from 'pinia';
//애플리케이션의 최상위 컴포넌트로 모든 화면의 뼈대 역할
import App from './App.vue'

//Vue 에서 페이지 이동을 관리하는 router 를 index.js 로 정의하고
//그것을 가져오는 것
import router from './router';

//Vuetify와 관련된 스타일과 설정을 가져옴. 
//Vuetify는 Vue를 위한 UI 컴포넌트 라이브러리, 버튼, 입력창 등 여러 UI 요소를 쉽게 만들도록 도와줌
//Vuetify의 어떤 기능이나 컴포넌트를 쓸지 설정을 정의하는 함수를 가져옴
import { createVuetify } from 'vuetify'; 
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles'; //vuetify 스타일
import * as components from 'vuetify/components' //vuetify 컴포넌트, vuetify가 제공하는 UI 요소들
import * as directives from 'vuetify/directives' //vuetify 디렉티브, 특정 동작을 추가하는 기능들 (스크롤 디텍션 등.)

//vuetify 설정 생성
const vuetify = createVuetify({
    //vuetify 설정에 컴포넌트와 디렉티브를 추가
    components,
    directives,
})

//Vue 애플리케이션 생성
const app = createApp(App);
const pinia = createPinia();
// user는 Vue 애플리케이션에 플러그인(라이브러리)를 적용하는 함수.
// Vue Router를 애플리케이션에 추가
app.use(router);

//Vuetify 애플리케이션에 추가
app.use(vuetify);
app.use(pinia);
//애플리케이션을 #app 요소에 마운트함. HTML 파일의 특정 요소에 연결하는 과정
//index.html 의 <div id="app"><div> 인 요소를 Vue 애플리케이션이 사용하는 영역으로 지정
//App.vue 즉 Vue 애플리케이션의 내용이 이 <div> 안에 렌더링 되는 것
app.mount('#app');