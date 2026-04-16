<template>
  <!-- 首次渲染不要使用 prevent 阻止 touchstart 和 touchend，以确保 click 能正常触发 -->
  <!-- touchstart -> touchend -> mousedown -> mouseup -> click -->
  <div
    class="tap"
    :data-tapitem="tid"
    @mousedown="mouseDown"
    @mouseover="mouseOver"
    @mouseout="mouseOut"
    @mouseup="mouseUp"
    @touchstart="touchHandle"
    @touchmove.prevent="touchHandle"
    @touchend="touchHandle"
  >
    <slot></slot>
  </div>
</template>

<script>
import { findEl, hasParent } from '../../lib/util'

// 全局共享状态
let isMouseDown = false
let hasTouchEvt = false

window.addEventListener('mouseup', () => (isMouseDown = false))

export default {
  props: ['tid'],
  data() {
    return {
      touches: [],
      pressMap: {}
    }
  },
  mounted() {
    // 监听全屏变化，重置触摸事件状态
    const fullscreenChangeHandler = () => {
      // 重置全局触摸事件标记，确保全屏后事件正常
      hasTouchEvt = false
      isMouseDown = false
      console.log('全屏状态变化，重置事件标记')
    }
    
    document.addEventListener('fullscreenchange', fullscreenChangeHandler)
    document.addEventListener('webkitfullscreenchange', fullscreenChangeHandler)
    document.addEventListener('mozfullscreenchange', fullscreenChangeHandler)
    document.addEventListener('MSFullscreenChange', fullscreenChangeHandler)
    
    this._fullscreenHandler = fullscreenChangeHandler
  },
  beforeUnmount() {
    // 清理事件监听
    if (this._fullscreenHandler) {
      document.removeEventListener('fullscreenchange', this._fullscreenHandler)
      document.removeEventListener('webkitfullscreenchange', this._fullscreenHandler)
      document.removeEventListener('mozfullscreenchange', this._fullscreenHandler)
      document.removeEventListener('MSFullscreenChange', this._fullscreenHandler)
    }
  },
  methods: {
    press(key) {
      this.$emit('tapdown', key)
    },
    release(key) {
      this.$emit('tapup', key)
    },
    mouseDown(e) {
      if (hasTouchEvt) return

      const k = this.tid

      if (!this.pressMap[k]) {
        this.press(k)
        isMouseDown = true
        this.pressMap[k] = 'M'
      }
      // console.log('mouseDown', e, k)
    },
    mouseUp(e) {
      if (hasTouchEvt) return

      const k = this.tid

      if (isMouseDown && this.pressMap[k] == 'M') {
        this.release(k)
        delete this.pressMap[k]
        isMouseDown = false
      }
      // console.log('mouseUp', isMouseDown)
    },
    mouseOver(e) {
      const k = this.tid

      // console.log('mouseOver', e)
      if (isMouseDown && !this.pressMap[k]) {
        this.press(k)
        this.pressMap[k] = 'M'
      }
    },
    mouseOut(e) {
      const k = this.tid

      if (
        isMouseDown &&
        this.pressMap[k] == 'M' &&
        !hasParent(e.relatedTarget, this.$el)
      ) {
        // console.log('mouseOut', e.relatedTarget)
        this.release(k)
        delete this.pressMap[k]
      }
    },
    touchHandle(e) {
      if (hasTouchEvt) {
        e.preventDefault()
      } else if (e.type === 'touchend') {
        // 在 touchend 后执行此逻辑，以确保 click 被响应
        hasTouchEvt = true
      }

      // 移动端支持多点触摸
      const targets = this.getTouchTargets(e.touches)

      this.releaseTouches(targets)
      this.touches = this.markTouches(targets)

      return true
    },
    markTouches(targets) {
      const inTouches = k => this.touches.indexOf(k) > -1

      return targets
        .map(k => {
          if (inTouches(k)) {
            return k
          } else if (!this.pressMap[k]) {
            this.press(k)
            this.pressMap[k] = 'T'

            return k
          }
        })
        .filter(Boolean)
    },
    releaseTouches(targets) {
      const matchTargets = k => targets.indexOf(k) > -1

      // 释放不在当前目标中的项目
      this.touches.forEach(k => {
        if (matchTargets(k)) return

        this.release(k)
        delete this.pressMap[k]
      })
    },
    getTouchTargets(touches) {
      const finder = el => el.dataset && el.dataset['tapitem']

      return [...touches]
        .map(el => findEl(el.clientX, el.clientY, finder))
        .filter(Boolean)
    },
    click() {
      console.log('click')
    }
  }
}
</script>

<style scoped>
.tap {
  height: 100%;
  width: 100%;
}
</style>
