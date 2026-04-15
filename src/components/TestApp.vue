<template>
  <div style="background: red; color: white; padding: 50px; font-size: 30px;">
    <h1>测试页面</h1>
    <p>如果你能看到这个红色背景，说明Vue3正常工作</p>
    <p>当前时间: {{ new Date().toLocaleString() }}</p>
  </div>
</template>

<script setup>
console.log('TestApp loaded')
</script>
