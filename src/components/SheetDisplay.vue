<template>
  <div class="sheet-display" v-if="show">
    <div class="sheet-header">
      <h3>{{ sheetTitle || '琴谱显示' }}</h3>
      <button @click="close" class="close-btn">✕</button>
    </div>
    
    <div class="sheet-content" ref="sheetContent">
      <div class="sheet-notes">
        <div 
          v-for="(note, index) in notes" 
          :key="index"
          class="note-item"
          :class="{ 
            'current': index === currentIndex,
            'played': index < currentIndex,
            'upcoming': index > currentIndex
          }"
        >
          <div class="note-key">{{ note.key }}</div>
          <div class="note-info">{{ note.note }}</div>
        </div>
      </div>
    </div>

    <div class="sheet-controls">
      <button @click="scrollToCurrent" class="scroll-btn">
        📍 定位当前
      </button>
      <div class="position-info">
        {{ currentIndex + 1 }} / {{ notes.length }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    notes: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    },
    sheetTitle: {
      type: String,
      default: ''
    }
  },
  watch: {
    currentIndex: {
      handler(newVal, oldVal) {
        // 自动滚动到当前音符
        console.log('📖 琴谱滚动:', oldVal, '->', newVal)
        this.$nextTick(() => {
          this.scrollToCurrent()
        })
      },
      immediate: false
    },
    show(newVal) {
      if (newVal) {
        // 显示时立即滚动到当前位置
        this.$nextTick(() => {
          this.scrollToCurrent()
        })
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    scrollToCurrent() {
      if (!this.$refs.sheetContent) {
        console.log('❌ sheetContent ref 不存在')
        return
      }
      
      const currentNote = this.$refs.sheetContent.querySelector('.note-item.current')
      if (currentNote) {
        console.log('✅ 滚动到音符:', this.currentIndex)
        currentNote.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        })
      } else {
        console.log('❌ 未找到当前音符元素')
      }
    }
  }
}
</script>

<style scoped>
.sheet-display {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 600px;
  background: rgba(0, 0, 0, 0.95);
  border: 2px solid rgba(254, 252, 178, 0.5);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
  z-index: 999;
  overflow: hidden;
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: rgba(254, 252, 178, 0.1);
  border-bottom: 1px solid rgba(254, 252, 178, 0.3);
}

.sheet-header h3 {
  margin: 0;
  color: #fefcb2;
  font-size: 14px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(254, 252, 178, 0.3);
  color: #fefcb2;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.sheet-content {
  padding: 12px 15px;
  max-height: 100px;
  overflow-x: auto;
  overflow-y: hidden;
}

.sheet-notes {
  display: flex;
  gap: 6px;
  padding: 5px 0;
}

.note-item {
  flex-shrink: 0;
  width: 45px;
  height: 60px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  position: relative;
}

.note-item.played {
  background: rgba(100, 100, 100, 0.3);
  border-color: rgba(150, 150, 150, 0.5);
  opacity: 0.5;
}

.note-item.current {
  background: linear-gradient(135deg, #fefcb2 0%, #f0e68c 100%);
  border-color: #fefcb2;
  transform: scale(1.15);
  box-shadow: 0 0 20px rgba(254, 252, 178, 0.6);
  animation: pulse 0.5s ease-in-out infinite alternate;
}

.note-item.current .note-key,
.note-item.current .note-info {
  color: #333;
  font-weight: bold;
}

.note-item.upcoming {
  background: rgba(254, 252, 178, 0.1);
  border-color: rgba(254, 252, 178, 0.3);
}

.note-key {
  font-size: 18px;
  font-weight: bold;
  color: #fefcb2;
  font-family: monospace;
}

.note-info {
  font-size: 9px;
  color: rgba(254, 252, 178, 0.7);
  margin-top: 2px;
}

.sheet-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  background: rgba(0, 0, 0, 0.5);
  border-top: 1px solid rgba(254, 252, 178, 0.3);
}

.scroll-btn {
  background: rgba(254, 252, 178, 0.2);
  border: 1px solid rgba(254, 252, 178, 0.5);
  color: #fefcb2;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.scroll-btn:hover {
  background: rgba(254, 252, 178, 0.3);
}

.position-info {
  color: #fefcb2;
  font-size: 12px;
  font-family: monospace;
}

@keyframes pulse {
  0% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1.2);
  }
}

/* 滚动条样式 */
.sheet-content::-webkit-scrollbar {
  height: 8px;
}

.sheet-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.sheet-content::-webkit-scrollbar-thumb {
  background: rgba(254, 252, 178, 0.5);
  border-radius: 4px;
}

.sheet-content::-webkit-scrollbar-thumb:hover {
  background: rgba(254, 252, 178, 0.7);
}
</style>
