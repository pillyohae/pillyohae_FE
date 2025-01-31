//axios 라이브러리를 가져옴 test
import axios from "axios";

//axios 인스턴스를 생성하여 기본 설정을 적용
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL, // 환경 변수 사용
    timeout: 5000, //요청시간 5초 안에 완료되지 않으면 에러
    headers: {
        'Content-Type' : 'application/json', //기본적으로 요청에 json 데이터를 보내도록 설정
    },
    withCredentials: true,
})

// axios 인스턴스의 요청 인터셉터를 사용 : 인터셉터는 모든 Axios 요청 전에 실행되는 함수
// 요청 객체를 받아서(config) 인증 정보(토큰 등)를 추가, 문제가 없으면 return config로 요청을 서버로 전송하는 과정
instance.interceptors.request.use(
    //config 는 axios 의 요청 설정 객체.요청 URL, 헤더, 데이터 등이 포함됨
    (config) => {
        //인증이 필요없는 경로를 정의
        const publicPaths = [
            '/refresh',
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

let isRefreshing = false; // 토큰 갱신 중인지 상태를 관리하는 변수 (만약 이미 토큰을 새로 요청 중이라면, 또 요청하지 않도록 막는 변수)
let failedQueue = []; // 토큰 갱신 중 401 에러가 발생하여 대기중인 요청들을 저장하는 배열

// 대기 중인 요청들을 처리하는 함수
// 새로운 토큰을 받아오면, 대기 중인 요청들(여러 개)을 해결, 받아오지 못하면 실패를 알리는메서드. 모두 처리한 뒤에는 대기열을 비우는 작업을 진행
const processQueue = (error, token = null) => {
  // 대기 중인 요청(failedQueue)에 저장된 모든 요청을 순회
  failedQueue.forEach((prom) => {
    // 새로운 토큰이 존재한다면 즉 갱신을 성공했다면
    if (token) {
      prom.resolve(token); // 새로운 토큰으로 대기 중인 요청을 처리
    } 
    //새로운 토큰이 존재하지않고 에러만 존재한다면 갱신 실패
    else {
      prom.reject(error); // 해당 요청에 에러를 반환
    }
  });
  failedQueue = []; // 대기열 초기화
};

// 응답 인터셉터 설정
instance.interceptors.response.use(
  (response) => response, // 성공적인 응답은 그대로 반환

  //응답이 에러를 반환했을 때 실행됨
  async (error) => {
    const originalRequest = error.config; // 실패한 요청 객체를 저장

    // 401 Unauthorized 에러가 반환되었을 경우, 인증이 필요하다는 의미이므로 
    // `_retry` 플래그로 이 요청이 다시 시도된 적이 있는지 확인하고 중복 요청을 막기위해 한번만 갱신 요청을 보냄
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 다른 요청이 이미 토큰을 갱신 중인 상태라 true 라면 
      if (isRefreshing) {
        //failedQueue 에 해당 요청을 추가하고 대기상태로 만듦
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            // 새 토큰이 오면 기다렸던 요청에 새토큰을 Authorization 헤더에 넣어 다시 요청을 실행
            originalRequest.headers['Authorization'] = token;
            return instance(originalRequest); // 요청 재시도
          })
          .catch((err) => Promise.reject(err)); // 에러 발생 시 요청 거부
      }

      // 다른 요청이 토큰을 갱신중인 상태가 아니라면 즉 isRefreshing 이 false 라면
      // `_retry` 플래그를 true 로 설정하여 다른 요청이 리프레시 토큰으로 액세스 토큰 발행 재시도를 하지 않도록 함
      originalRequest._retry = true;
      isRefreshing = true; // 토큰 갱신 시작 상태로 전환

      //이제 리프레시 토큰을 통해 갱신을 요청한다.
      try {
        //콘솔로 정상적으로 실행되었는지 확인
        console.log('Attempting to refresh token');

        // 서버에 토큰 갱신 요청 (쿠키에 담긴 refresh token 을 사용)
        const response = await instance.post('/refresh');

        // 반환받은 새로운 액세스 토큰을 응답 헤더에서 가져옴
        const newAccessToken = response.headers.authorization;
        //정상적으로 반환되었는지 콘솔로 확인
        console.log(newAccessToken);

        // 만약 새로운 액세스토큰이 존재하지 않는다면 error 를 반환
        if (!newAccessToken) {
          throw new Error('액세스 토큰이 반환되지 않았습니다.');
        }

        // 새로운 액세스 토큰이 존재한다면 로컬 스토리지에 저장 (갱신)
        localStorage.setItem('accessToken', newAccessToken);

        // axios의 기본 Authorization 헤더를 새로운 토큰으로 설정
        instance.defaults.headers.common['Authorization'] = newAccessToken;

        // 대기 중인 요청들을 새로운 토큰으로 처리
        processQueue(null, newAccessToken);

        // 토큰 갱신 상태 해제
        isRefreshing = false;

        // 실패했던 원래 요청에 새로운 토큰 추가 후 재시도
        originalRequest.headers['Authorization'] = newAccessToken;
        return instance(originalRequest);

      } catch (refreshError) {
        // 리프레시 토큰으로 액세스 토큰 갱신 실패 처리
        console.error('Failed to refresh token:', refreshError.response?.data || refreshError.message);

        // 대기 중인 요청들에 에러를 전달
        processQueue(refreshError, null);
        
        //갱신 상태를 false 로 만들어 다음에 갱신 요청이 일어났을 때 갱신 시도를 할 수 있도록 함
        isRefreshing = false;

        // 리프레시 토큰으로 갱신 실패한 경우 401 응답을 보내도록 서버에서 처리했기 때문에
        // 리프레시 토큰을 다시 받고싶다면 다시 로그인해야하므로 사용자 로그아웃 처리
        if (refreshError.response?.status === 401) {
          delete instance.defaults.headers.common['Authorization']; // 기존 토큰 제거
          this.$router.push('/login'); // 로그인 화면으로 이동
        }

        return Promise.reject(refreshError); // 에러 반환
      }
    }

    // 401 이외의 에러는 그대로 반환
    return Promise.reject(error);
  }
);



//설정된 axios 인스턴스를 내보냄. 컴포넌트에선 이 설정된 axios를 사용하게 됨
export default instance;
