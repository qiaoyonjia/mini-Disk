<template>
  <div>
    <file-table :file_list="list" :headers="headers"></file-table>
  </div>
</template>

<script>
import { Mixin } from "@/mixin/Mixin.js"
export default {
  name: "VideoTable",
  data() {
    return {
      type: "video"
    }
  },
  mixins: [Mixin]
}
</script>
