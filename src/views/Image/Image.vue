<template>
  <div>
    <file-table :file_list="list" :headers="headers"></file-table>
  </div>
</template>

<script>
import { Mixin } from "@/mixin/Mixin.js"
export default {
  name: "ImageTable",
  data() {
    return {
      type: "image"
    }
  },
  mixins: [Mixin]
}
</script>
