<template>
  <div class="note" :class="activeClass">
    <div class="note_content">
      <div class="note_shape">
        <Shape v-if="type === 'muti' || type === 'circle'" shape="circle" />
        <Shape v-if="type === 'muti' || type === 'rect'" shape="rect" />
      </div>
      <div class="key-label" v-if="keyLabel">{{ keyLabel }}</div>
    </div>
  </div>
</template>

<script>
import Stopwatch from '../../lib/Stopwatch'
import Shape from './Shape.vue'

export default {
  name: 'Note',
  props: ['type', 'keyLabel'],
  components: {
    Shape
  },
  data() {
    return {
      isAni: false,
      isActive: false,
      stopwatch: new Stopwatch()
    }
  },
  computed: {
    activeClass() {
      return {
        'note--active': this.isActive,
        'note--ani': this.isAni
      }
    }
  },
  methods: {
    tapdown() {
      // 触屏下 :active 无法处理多点触摸，因此使用 js 控制
      this.isActive = true
      this.isAni = true

      this.stopwatch.start()

      // 防止点击过快，保证动画完整性
      setTimeout(() => {
        this.isAni = false
      }, 300)
    },
    tapup() {
      const ms = this.stopwatch.check()
      const duration = 120

      // 防止点击过快，保证动画完整性
      if (ms < duration) {
        setTimeout(() => {
          this.isActive = false
        }, duration - ms)
      } else {
        this.isActive = false
      }
    },
    animationEnd() {
      console.log('animationEnd')
    }
  }
}
</script>

<style>
.note {
  height: 100%;
  width: 100%;
  border-radius: 10px;
  transform-style: preserve-3d;
  cursor: pointer;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  background-color: rgba(0, 0, 0, 0.2);
  transition: transform 0.1s ease-in;
}

.note.note--active {
  transform: scale(0.8);
  transition-timing-function: ease-out;
}

.note_content {
  width: 100%;
  height: 100%;
  transform: translateZ(0);
  transform-style: preserve-3d;
  backface-visibility: visible;
}

.note_shape {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: breathe 1s ease-in-out 2.5s both infinite alternate;
}

.note--ani .note_content {
  animation: rotateY 0.3s;
}

@keyframes rotateY {
  0% {
    transform: rotateY(0deg) translateZ(0);
  }

  100% {
    transform: rotateY(360deg) translateZ(0);
  }
}

@keyframes breathe {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.95);
  }
}

.rect::after {
  transform: rotate(45deg);
}

.cicle::after {
  border-radius: 50%;
}

.key-label {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #fefcb2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  font-family: monospace;
  pointer-events: none;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(254, 252, 178, 0.3);
}

.note--active .key-label {
  background: rgba(254, 252, 178, 0.9);
  color: #333;
  transform: translateX(-50%) scale(1.1);
  transition: all 0.1s ease;
}
</style>
