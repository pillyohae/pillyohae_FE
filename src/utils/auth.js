import api from '../api/axios'; // Axios 인스턴스
import router from '../router';
export async function logout() {
  try {
    router.push('/login'); // 로그인 화면으로 이동
    await api.post('/users/logout', {}, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    localStorage.removeItem("accessToken"); // 토큰 제거
    alert('로그아웃 되었습니다.');
    router.push('/login'); // 로그인 화면으로 이동
  } catch (error) {
    console.error("로그아웃 중 에러:", error.response?.data || error.message);
    router.push('/login');
    alert('로그아웃 실패: 서버 오류');
  }
}