<template>
    
  <v-app>
  <seller-navigation-bar/>

  <v-main>
    <seller-order-form></seller-order-form>
  </v-main>
</v-app>
</template>

<script setup>
import SellerNavigationBar from '../SellerNavigationBar.vue';
import SellerOrderForm from '../../../components/seller/order/SellerOrderForm.vue';

</script>

<style>

</style>