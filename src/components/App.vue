<template>
  <div class="sky-piano-app" :style="frameStyle">
    <AutoPlayPanel :keyboard="keyboard" :manualPlayEvent="manualPlayEvent" />
    <!-- <KeyboardHint /> -->
    
    <Droparea class="main" @drop="onDropMidi" accept="audio/midi">
      <Keyboard ref="keyboardRef" @play="onPlay" @manualPlay="onManualPlay" />
    </Droparea>

    <Waveline
      ref="wavelineRef"
      amplitude="0.5"
      speed="0.01"
      :width="stageSize.width"
    />

    <SetBg class="set-bg" @get-bg="changeBg" />

    <Version />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, provide } from 'vue'
import Keyboard from './keyboard/Layout.vue'
import Droparea from './Droparea.vue'
import Waveline from './Waveline.vue'
import Version from './Version.vue'
import SetBg from './SetBg.vue'
import KeyboardHint from './KeyboardHint.vue'
import AutoPlayPanel from './AutoPlayPanel.vue'
import { fixOrientation } from '../lib/clientSize'
import defaultBgUrl from '../assets/bg.jpg'
import eventBus from '../lib/events'

const keyboardRef = ref(null)
const wavelineRef = ref(null)
const stageSize = ref(fixOrientation())
// 优先使用localStorage中保存的背景图
const savedBgUrl = localStorage.getItem('bgUrl')
const bgUrl = ref(savedBgUrl || defaultBgUrl)
const tracks = ref(0)
const keyboard = ref(null)
const manualPlayEvent = ref(null)

let _playerPromise = null

const frameStyle = computed(() => {
  // 不再设置宽高，让CSS媒体查询完全控制
  return {
    backgroundImage: `url(${bgUrl.value})`
  }
})

const changeBg = (url) => {
  bgUrl.value = url
  localStorage.setItem('bgUrl', url)
}

const initWaveLine = () => {
  wavelineRef.value?.start()
}

const onPlay = (note) => {
  wavelineRef.value?.touch(1)
}

const onManualPlay = (event) => {
  // 传递手动演奏事件给AutoPlayPanel
  // 每次创建新对象，确保watch能触发
  manualPlayEvent.value = {
    ...event,
    timestamp: Date.now()
  }
  console.log('🎹 手动演奏:', event)
}

const getPlayer = () => {
  if (_playerPromise) {
    return _playerPromise
  }

  _playerPromise = import('../lib/midiPlayer')
    .then(mod => mod.default)
    .then(player => {
      return player.setEventProxy(eventBus)
    })

  eventBus.on('player:fileLoaded', ctx => {
    tracks.value = ctx.tracks.length
  })

  eventBus.on('player:midiEvent', e => {
    const note = e.noteName

    if (e.name === 'Note on') {
      if (e.velocity > 0) {
        keyboard.value?.tapdown(note, e.channel)
      } else {
        keyboard.value?.tapup(note)
      }
    } else if (e.name === 'Note off') {
      keyboard.value?.tapup(note)
    }
  })

  eventBus.on('player:play', () => {
    console.log('[player] play')
  })

  eventBus.on('player:sleep', () => {
    keyboard.value?.release()
    console.log('[player] sleep')
  })

  console.log('[player] regist')

  return _playerPromise
}

const onDropMidi = (res) => {
  getPlayer().then(player => {
    player.stop()

    if (res.code === 0) {
      player.load(res.data, res.file).play()
      console.log('play', res.file)
    }
  })
}

provide('getPlayer', getPlayer)

onMounted(() => {
  keyboard.value = keyboardRef.value
  initWaveLine()

  window.addEventListener(
    'resize',
    () => {
      stageSize.value = fixOrientation()
    },
    false
  )
})
</script>
