<template>
    <v-container>
      <h2>결제가 성공적으로 완료되었습니다!</h2>
      <p>결제 key: {{ paymentKey }}</p>
      <p>주문 ID: {{ orderId }}</p>
      <p>결제 금액: {{ amount }}원</p>
      <v-btn color="green" @click="handleClose">메인으로 돌아가기</v-btn>
    </v-container>
  </template>
  
  <script>

  import api from '../../api/axios';

  export default {
    name: 'SuccessPage',
    data() {
      return {
        paymentKey: null,
        orderId: null,
        amount: null,
      };
    },
    methods: {
      async confirm() {
        const urlParams = new URLSearchParams(window.location.search);
        this.paymentKey = urlParams.get('paymentKey');
        this.orderId = urlParams.get('orderId');
        this.amount = urlParams.get('amount');

        const requestData = {
          paymentKey: this.paymentKey,
          orderId: this.orderId,
          amount: this.amount,
        };

        try {
          const response = await api.post('/toss/confirm', requestData);

          if (response.status !== 200) {
            const json = response.data;
            console.log('결제 실패:', json);
            this.$router.push(`/fail?message=${json.message}&code=${json.code}`);
          } else {
            console.log('결제 성공:', response.data);
          }
        } catch (error) {
          console.error('결제 확인 중 오류 발생:', error);
          this.$router.push('/fail?message=결제 확인 중 오류가 발생했습니다.');
        }
      },
      handleClose() {
      // 팝업 창 닫기 시도
      if (window.opener) {
        window.close();
      } else {
        // 팝업 창이 아니면 메인으로 리다이렉트
        this.$router.push('/products');
      }
    },
    },
    mounted() {
      this.confirm();
    },
  };
  </script>
  
  <style scoped>
  </style>
