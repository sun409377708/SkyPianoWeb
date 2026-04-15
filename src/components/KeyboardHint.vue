<template>
  <div class="keyboard-hint">
    <div class="hint-toggle" @click="toggleHint">
      <span>{{ show ? '◀' : '▶' }}</span>
    </div>
    <transition name="slide">
      <div class="hint-content" v-if="show">
        <h3>🎹 键盘映射</h3>
        <div class="hint-row">
          <span class="hint-label">第一行:</span>
          <kbd>Y</kbd> <kbd>U</kbd> <kbd>I</kbd> <kbd>O</kbd> <kbd>P</kbd>
        </div>
        <div class="hint-row">
          <span class="hint-label">第二行:</span>
          <kbd>H</kbd> <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd> <kbd>;</kbd>
        </div>
        <div class="hint-row">
          <span class="hint-label">第三行:</span>
          <kbd>N</kbd> <kbd>M</kbd> <kbd>,</kbd> <kbd>.</kbd> <kbd>/</kbd>
        </div>
        <p class="hint-tip">💡 按键盘字母即可演奏</p>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: true  // 默认显示，不自动隐藏
    }
  },
  methods: {
    toggleHint() {
      this.show = !this.show
    }
  }
}
</script>

<style scoped>
.keyboard-hint {
  position: fixed;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
}

.hint-toggle {
  background: rgba(0, 0, 0, 0.7);
  color: #fefcb2;
  padding: 20px 8px;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  font-size: 18px;
  user-select: none;
  transition: background 0.3s;
  writing-mode: vertical-rl;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.3);
}

.hint-toggle:hover {
  background: rgba(0, 0, 0, 0.9);
}

.hint-content {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
  border-radius: 8px 0 0 8px;
  min-width: 280px;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.5);
  border-right: 3px solid #fefcb2;
}

.hint-content h3 {
  margin: 0 0 15px 0;
  color: #fefcb2;
  font-size: 16px;
  text-align: center;
}

.hint-row {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hint-label {
  color: #fefcb2;
  font-size: 14px;
  min-width: 60px;
}

kbd {
  display: inline-block;
  padding: 4px 8px;
  background: linear-gradient(180deg, #fff 0%, #e0e0e0 100%);
  border: 1px solid #999;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  color: #333;
  font-family: monospace;
  font-size: 14px;
  font-weight: bold;
  min-width: 28px;
  text-align: center;
}

.hint-tip {
  margin: 15px 0 0 0;
  font-size: 12px;
  color: #fefcb2;
  text-align: center;
  opacity: 0.9;
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s;
}

.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
