<template>
  <div class="progress d-flex align-center">
    <div
      class="box d-flex align-center"
      :style="{
        width: active ? `${complated}%` : '0'
      }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "ProgressLinear",
  props: {
    complated: {
      type: Number,
      require: true
    },
    active: {
      type: Boolean,
      require: true
    }
  }
}
</script>

<style scoped lang="scss">
.progress {
  width: calc(100% - 32px);
  height: 100%;
  position: absolute;
  z-index: 0;
}
.box {
  height: 90%;
  background: linear-gradient(to right, #6aa0fc, #2962ff);
  transition: width 200ms ease;
}
</style>
