<template>
  <div>
    <!-- 결제 진행 화면 -->
    <h2>결제 진행 중...</h2>

    <!-- 결제 수단 선택 UI가 삽입될 영역 -->
    <div id="payment-method" style="margin-top: 20px;"></div>

    <!-- 결제 약관 동의 UI가 삽입될 영역 -->
    <div id="agreement" style="margin-top: 20px;"></div>

    <!-- 결제하기 버튼 -->
    <button class="button" id="payment-button" style="margin-top: 30px">결제하기</button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

// 컴포넌트가 마운트되면 결제 위젯 초기화
onMounted(async () => {
  try {
    // URL 파라미터에서 결제 관련 데이터 추출
    const params = new URLSearchParams(window.location.search);
    const clientKey = params.get('clientKey'); // TossPayments 클라이언트 키
    const customerKey = params.get('customerKey'); // 고객 식별 키
    const orderId = params.get('orderId'); // 주문 ID
    const orderName = params.get('orderName'); // 주문 이름
    const totalAmount = Number(params.get('totalAmount')); // 총 결제 금액
    const customerEmail = params.get('customerEmail'); // 고객 이메일
    const customerName = params.get('customerName'); // 고객 이름
    const customerMobilePhone = params.get('customerMobilePhone').replace(/-/g, ''); // 고객 전화번호 (하이픈 제거)
    const successUrl = params.get('successUrl'); // 결제 성공 시 이동할 URL
    const failUrl = params.get('failUrl'); // 결제 실패 시 이동할 URL

    // TossPayments SDK 로드 및 초기화
    const tossPayments = await loadTossPayments(clientKey);

    // TossPayments 결제 위젯 생성
    const widgets = tossPayments.widgets({ customerKey });

    // 결제 금액 설정
    await widgets.setAmount({
      currency: 'KRW', // 통화 단위 (원화)
      value: totalAmount, // 총 결제 금액
    });

    // 결제 수단 및 약관 UI 렌더링
    await Promise.all([
      widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }), // 결제 수단 UI
      widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }), // 약관 동의 UI
    ]);

    // 결제 버튼 클릭 이벤트 리스너 추가
    const button = document.getElementById('payment-button');
    button.addEventListener('click', async () => {
      try {
        // 결제 요청
        await widgets.requestPayment({
          orderId, // 주문 ID
          orderName, // 주문 이름
          successUrl, // 결제 성공 시 이동할 URL
          failUrl, // 결제 실패 시 이동할 URL
          customerEmail, // 고객 이메일
          customerName, // 고객 이름
          customerMobilePhone, // 고객 전화번호
        });
      } catch (error) {
        console.error('결제 요청 실패:', error);
        alert('결제를 진행할 수 없습니다. 다시 시도해주세요.');
      }
    });
  } catch (error) {
    console.error('결제 페이지 초기화 실패:', error);
    alert('결제 페이지를 로드하는 중 오류가 발생했습니다.');
  }
});
</script>

<style scoped>
/* 결제 UI 스타일 */
#payment-method {
  margin: 20px 0;
}

#agreement {
  margin: 20px 0;
}

/* 결제하기 버튼 스타일 */
.button {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.button:hover {
  background-color: #45a049;
}
</style>
