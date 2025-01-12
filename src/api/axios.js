//axios 라이브러리를 가져옴
import axios from "axios";

//axios 인스턴스를 생성하여 기본 설정을 적용
const instance = axios.create({
    baseURL: 'http://localhost:8080', //api 의 기본 URL 나중에 환경변수로 설정
    timeout: 5000, //요청시간 5초 안에 완료되지 않으면 에러
    headers: {
        'Content-Type' : 'application/json', //기본적으로 요청에 json 데이터를 보내도록 설정
    },
})

// axios 인스턴스의 요청 인터셉터를 사용 : 인터셉터는 모든 Axios 요청 전에 실행되는 함수
// 요청 객체를 받아서(config) 인증 정보(토큰 등)를 추가, 문제가 없으면 return config로 요청을 서버로 전송하는 과정
instance.interceptors.request.use(
    //config 는 axios 의 요청 설정 객체.요청 URL, 헤더, 데이터 등이 포함됨
    (config) => {
        //인증이 필요없는 경로를 정의
        const publicPaths = [
            '/users/login', // 로그인
            '/users/signup', // 회원가입
            '/toss/fail', // 결제 실패
            '/toss/success', // 결제 성공
            '/toss/confirm', // 결제 확인
        ];

        //요청 URL 이 인증이 필요없는 경로인지 확인
        //config.url 은 요청하려는 URL을 나타냄. 예를 들어, axios.get('/users/login')를 호출하면 config.url은 '/users/login'
        //Array.prototype.some()은 배열의 요소 중 하나라도 조건에 만족하면 true를 반환. 여기서 path는 publicPaths 배열의 각 요소를 의미
        const isPublicPath = publicPaths.some((path) => config.url.startsWith(path));

        //인증이 필요한 토큰인 경우 : isPublicPath = false 이므로 실행됨
        if(!isPublicPath) {
            //로컬 스토리지에 저장되어있는 액세스 토큰을 가져옴
            const token = localStorage.getItem('accessToken');
            if (token) {
                //토큰이 존재하면 요청 헤더에 추가.
                config.headers.Authorization = token;
            }
        }

        //요청 인터셉터가 config를 반환하면 Axios가 서버에 요청을 보냄
        return config;
    },
    //error는 요청 객체를 설정하는 도중 발생한 오류 객체, 잘못된 URL을 설정하거나, 요청 객체에 필수 데이터가 누락된 경우 오류가 발생할 수 있음
    (error) => {
        //요청 설정 중 오류가 발생하면 Promise를 거부(reject)하는 역할
        //Axios는 비동기 요청 라이브러리로, 모든 요청이 Promise 객체로 동작
        //Promise는 비동기 작업의 성공(resolve) 또는 실패(reject)를 나타내는 객체

        return Promise.reject(error); //이 요청은 실패했다"고 선언하며, 이를 호출한 곳으로 오류를 전달

    }
);

//설정된 axios 인스턴스를 내보냄. 컴포넌트에선 이 설정된 axios를 사용하게 됨
export default instance;
