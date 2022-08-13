<template>
<!-- 不能放div，会独占一行 -->
  <a :title="title" style="margin:10px">
    <el-button type="primary" v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
    name:'HintButton',
    props:['title'],

}
</script>

<style>

</style> 