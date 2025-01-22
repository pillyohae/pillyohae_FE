<template>
  <v-container>
    <h2>결제가 성공적으로 완료되었습니다!</h2>
    <p>결제 key: {{ paymentKey }}</p>
    <p>주문 ID: {{ orderId }}</p>
    <p>결제 금액: {{ amount }}원</p>
    <v-btn color="green" @click="handleClose">확인</v-btn>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import router from "../../../router";
import api from '../../../api/axios';


// 결제 데이터 변수
const paymentKey = ref('');
const orderId = ref('');
const amount = ref('');

// 결제 확인 함수
const confirm = async () => {
  const urlParams = new URLSearchParams(window.location.search);

  // URL에서 결제 정보 추출
  paymentKey.value = urlParams.get('paymentKey');
  orderId.value = urlParams.get('orderId');
  amount.value = urlParams.get('amount');

  console.log(paymentKey);
  console.log(orderId);
  console.log(amount);

  const requestData = {
    paymentKey: paymentKey.value,
    orderId: orderId.value,
    amount : amount.value,
  };

  try {
    // 결제 확인 요청
    const response = await api.post('/toss/confirm', requestData);

    if (response.status !== 200) {
      // 결제 실패 처리
      const json = response.data;
      console.error('결제 실패:', json);
      router.push(`/fail?message=${json.message}&code=${json.code}`);
    } else {
      // 결제 성공 처리
      console.log('결제 성공:', response.data);
    }
  } catch (error) {
    // 결제 확인 중 오류 처리
    console.error('결제 확인 중 오류 발생:', error);
    router.push('/fail?message=결제 확인 중 오류가 발생했습니다.');
  }
};

// 팝업 창 닫기 함수
const handleClose = () => {
  if (window.opener) {
    // 부모 창 경로 변경
    window.opener.location.href = '/buyer';
    // 팝업 창 닫기
    window.close();
  } else {
    // 팝업 창이 아니면 메인으로 리다이렉트
    router.push('/products');
  }
};

// 컴포넌트가 마운트되면 결제 확인 함수 호출
onMounted(() => {
  confirm();
});
</script>

<style scoped></style>
