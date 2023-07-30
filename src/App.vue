<template>
  <v-app>
    <!-- 全局通知组件 -->
    <v-snackbar v-model="$store.state.snackbar" top :color="$store.state.snackbar_color" :timeout="$store.state.snackbar_timeout">
      <span class="d-flex justify-center align-center">{{ $store.state.snackbar_text }}</span>
    </v-snackbar>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App"
}
</script>
