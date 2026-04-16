<template>
  <div class="keyboard">
    <ul class="keyboard_wrap">
      <li v-for="(item, index) in list" :key="item.note" :data-tapitem="item.note">
        <!-- 封装点击与触摸 -->
        <Tap :tid="item.note" @tapdown="tapdown" @tapup="tapup">
          <Note 
            :ref="el => { if (el) noteRefs['n_' + item.note] = el }" 
            :type="item.shape"
            :keyLabel="getKeyLabel(index)"
          />
        </Tap>
      </li>
    </ul>
  </div>
</template>

<script>
import Note from './Note.vue'
import Tap from './Tap.vue'
import SmapleLibrary from '../../lib/Tonejs-Instruments'
import wintip from '../../lib/wintip'

const conf = {
  total: 15,
  tone: 4,
  shapes: ['muti', 'rect', 'circle'],
  notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
}

export default {
  name: 'Keyboard',
  components: {
    Note,
    Tap
  },
  data() {
    return {
      list: createKeyboard(conf),
      noteRefs: {}
    }
  },
  created() {
    // console.table(createKeyboard(conf))
  },
  mounted() {
    this.synth = SmapleLibrary.load({
      instruments: 'piano'
    }).toDestination()
    
    // 启用键盘映射
    this.initKeyboardMapping()
  },
  beforeUnmount() {
    // 清理键盘事件监听
    if (this.handleKeyDown) {
      window.removeEventListener('keydown', this.handleKeyDown)
      window.removeEventListener('keyup', this.handleKeyUp)
    }
  },
  methods: {
    play(noteName) {
      // 检查音频buffer是否已加载
      if (this.synth && this.synth.loaded) {
        try {
          this.synth.triggerAttackRelease(noteName)
          this.$emit('play', noteName)
        } catch (error) {
          console.warn('播放音符失败:', noteName, error)
        }
      } else {
        console.warn('音频尚未加载完成')
      }
    },
    tapdown(noteName, channel = 1) {
      this.play(noteName)
      this.tapNote(noteName, 'down')

      console.log('tap', noteName, 'channel', channel)
    },
    tapup(noteName) {
      this.tapNote(noteName, 'up')
    },
    tapNote(noteName, action) {
      const ins = this.noteRefs[`n_${noteName}`]

      if (!ins) return

      if (action === 'down') {
        ins.tapdown()
      } else {
        ins.tapup()
      }
    },
    release() {
      this.list.forEach(e => this.tapNote(e.note, 'up'))
    },
    getKeyLabel(index) {
      // 返回对应索引的键盘按键标签
      const labels = ['Y', 'U', 'I', 'O', 'P', 'H', 'J', 'K', 'L', ';', 'N', 'M', ',', '.', '/']
      return labels[index] || ''
    },
    initKeyboardMapping() {
      // 键盘布局映射
      const KEY_MAP = {
        // 第一行：y u i o p
        'y': 0, 'u': 1, 'i': 2, 'o': 3, 'p': 4,
        // 第二行：h j k l ;
        'h': 5, 'j': 6, 'k': 7, 'l': 8, ';': 9,
        // 第三行：n m , . /
        'n': 10, 'm': 11, ',': 12, '.': 13, '/': 14
      }
      
      const pressedKeys = new Set()
      
      this.handleKeyDown = (event) => {
        // 防止在输入框中触发
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
          return
        }
        
        const key = event.key.toLowerCase()
        
        if (key in KEY_MAP && !pressedKeys.has(key)) {
          event.preventDefault()
          pressedKeys.add(key)
          
          const index = KEY_MAP[key]
          if (index < this.list.length) {
            const note = this.list[index].note
            this.tapdown(note)
            // 发出手动演奏事件
            this.$emit('manualPlay', { index, key: key.toUpperCase(), note })
          }
        }
      }
      
      this.handleKeyUp = (event) => {
        const key = event.key.toLowerCase()
        
        if (key in KEY_MAP && pressedKeys.has(key)) {
          event.preventDefault()
          pressedKeys.delete(key)
          
          const index = KEY_MAP[key]
          if (index < this.list.length) {
            const note = this.list[index].note
            this.tapup(note)
          }
        }
      }
      
      window.addEventListener('keydown', this.handleKeyDown)
      window.addEventListener('keyup', this.handleKeyUp)
      
      console.log('🎹 键盘映射已启用')
      console.log('第一行: Y U I O P')
      console.log('第二行: H J K L ;')
      console.log('第三行: N M , . /')
    }
  }
}

function createKeyboard({ total, tone, notes, shapes }) {
  const first = shapes[0]
  const rest = shapes.slice(1)
  const nlen = notes.length
  let currLv = tone - 1

  return [...Array(total)].map((e, i) => {
    const shape = i % nlen == 0 ? first : rest[i % rest.length]
    const note = notes[i % nlen]

    if (note === notes[0]) currLv++

    return { shape, note: note + currLv, index: i }
  })
}
</script>

<style>
.keyboard {
  height: 68vmin;
  max-height: 380px;
  width: calc(68vmin / 3 * 5);
  max-width: calc(380px / 3 * 5);
  position: relative;
}

.keyboard_wrap {
  width: 100%;
  height: 100%;
  list-style: none;
  user-select: none;
}

.drop-area {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: copy;
  outline: 2px dashed #fefcb2;
  background-color: rgba(255, 255, 255, 0.2);
}

.keyboard_wrap::before,
.keyboard_wrap::after {
  display: block;
  content: '';
  clear: both;
}

.keyboard_wrap li {
  width: calc(100% / 5);
  height: calc(100% / 3);
  float: left;
  padding: 1.5%;
  overflow: hidden;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
</style>
