<template>
    <div>
      <h2>결제 진행 중...</h2>
      <div id="payment-method" style="margin-top: 20px;"></div>
      <div id="agreement" style="margin-top: 20px;"></div>
      <button class="button" id="payment-button" style="margin-top: 30px">결제하기</button>
    </div>
  </template>
  
  <script>
  import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
  
  export default {
    name: 'PaymentPage',
    async mounted() {
      try {
        const params = new URLSearchParams(window.location.search);
  
        // 전달받은 데이터 추출
        const clientKey = params.get('clientKey');
        const customerKey = params.get('customerKey');
        const orderId = params.get('orderId');
        const orderName = params.get('orderName');
        const totalAmount = Number(params.get('totalAmount'));
        const customerEmail = params.get('customerEmail');
        const customerName = params.get('customerName');
        const customerMobilePhone = params.get('customerMobilePhone').replace(/-/g, '');
        const successUrl = params.get('successUrl');
        const failUrl = params.get('failUrl');

        // TossPayments 초기화
        const tossPayments = await loadTossPayments(clientKey);
  
        // 결제 위젯 초기화
        const widgets = tossPayments.widgets({ customerKey });
  
        // 주문의 결제 금액 설정
        await widgets.setAmount({
          currency: 'KRW',
          value: totalAmount,
        });
  
        // 결제 UI 및 약관 UI 렌더링
        await Promise.all([
          widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
          widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
        ]);
  
        // 결제하기 버튼 클릭 이벤트
        const button = document.getElementById('payment-button');
        button.addEventListener('click', async () => {
          try {
            await widgets.requestPayment({
              orderId,
              orderName,
              successUrl,
              failUrl,
              customerEmail,
              customerName,
              customerMobilePhone,
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
    },
  };
  </script>
  
  <style scoped>
  #payment-method {
    margin: 20px 0;
  }
  #agreement {
    margin: 20px 0;
  }
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
  