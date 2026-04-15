<template>
  <div class="sky-piano-app" style="background: #333; color: white; padding: 50px;">
    <h1>简化版App - 逐步测试</h1>
    <p>Stage Size: {{ stageSize.width }} x {{ stageSize.height }}</p>
    <p>Background URL: {{ bgUrl }}</p>
    
    <!-- 逐步取消注释测试每个组件 -->
    <!-- <Version /> -->
    <!-- <SetBg class="set-bg" @get-bg="changeBg" /> -->
    <!-- <Waveline ref="wavelineRef" amplitude="0.5" speed="0.01" :width="stageSize.width" /> -->
    <!-- <Droparea class="main" @drop="onDropMidi" accept="audio/midi">
      <Keyboard ref="keyboardRef" @play="onPlay" />
    </Droparea> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// import Keyboard from './keyboard/Layout.vue'
// import Droparea from './Droparea.vue'
// import Waveline from './Waveline.vue'
// import Version from './Version.vue'
// import SetBg from './SetBg.vue'
import { fixOrientation } from '../lib/clientSize'
import defaultBgUrl from '../assets/bg.jpg'

const stageSize = ref(fixOrientation())
const bgUrl = ref(defaultBgUrl)

console.log('SimpleApp setup', { stageSize: stageSize.value, bgUrl: bgUrl.value })

onMounted(() => {
  console.log('SimpleApp mounted')
})
</script>
