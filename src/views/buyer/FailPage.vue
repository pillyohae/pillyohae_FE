<template>
  <v-container>
    <h2>결제 실패</h2>
    <p> {{ code }} </p>
    <p> {{ message }} </p>
  </v-container>
</template>

<script>
export default {
    name: 'FailPage',
    data() {
        return {
        code: null,
        message: null,
      };
    },

}
</script>

<style>

</style>