<template>
  <div class="auto-play-panel">
    <div class="panel-toggle" @click="togglePanel">
      <span>{{ showPanel ? '🎵' : '🎵' }}</span>
    </div>
    
    <transition name="slide-down">
      <div class="panel-content" v-if="showPanel">
        <h3>🎹 自动演奏</h3>
        
        <!-- 预设曲目 -->
        <div class="preset-songs">
          <button 
            v-for="song in presetSongs" 
            :key="song.id"
            @click="loadPreset(song)"
            class="song-btn"
            :class="{ active: currentSong === song.id }"
          >
            {{ song.title }}
          </button>
        </div>

        <!-- 自定义输入 -->
        <div class="custom-input">
          <textarea 
            v-model="customSheet"
            placeholder="输入简谱键位，例如: Y Y U I I U U | I I O P P O I U"
            rows="3"
          ></textarea>
          <button @click="loadCustom" class="load-btn">加载自定义</button>
        </div>

        <!-- 播放控制 -->
        <div class="controls">
          <button @click="play" :disabled="!hasSheet || isPlaying" class="ctrl-btn play-btn">
            ▶️ 播放
          </button>
          <button @click="pause" :disabled="!isPlaying" class="ctrl-btn pause-btn">
            ⏸️ 暂停
          </button>
          <button @click="stop" :disabled="!hasSheet" class="ctrl-btn stop-btn">
            ⏹️ 停止
          </button>
        </div>

        <!-- 琴谱显示按钮 -->
        <div class="sheet-toggle" v-if="hasSheet">
          <button @click="toggleSheet" class="sheet-btn">
            {{ showSheet ? '📖 隐藏琴谱' : '📖 显示琴谱' }}
          </button>
        </div>

        <!-- 播放进度 -->
        <div class="progress" v-if="hasSheet">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <div class="progress-text">
            {{ currentIndex }} / {{ totalNotes }} ({{ progress }}%)
          </div>
        </div>

        <!-- 当前曲目信息 -->
        <div class="current-song" v-if="currentSongTitle">
          <span>🎵 {{ currentSongTitle }}</span>
        </div>
      </div>
    </transition>

    <!-- 琴谱显示组件 -->
    <SheetDisplay 
      :show="showSheet"
      :notes="sheetNotes"
      :currentIndex="currentIndex"
      :sheetTitle="currentSongTitle"
      @close="showSheet = false"
    />
  </div>
</template>

<script>
import AutoPlayer from '../lib/autoPlayer'
import SheetDisplay from './SheetDisplay.vue'

export default {
  components: {
    SheetDisplay
  },
  props: ['keyboard', 'manualPlayEvent'],
  data() {
    return {
      showPanel: false,
      showSheet: false,
      autoPlayer: null,
      hasSheet: false,
      isPlaying: false,
      currentIndex: 0,
      totalNotes: 0,
      progress: 0,
      currentSong: null,
      currentSongTitle: '',
      customSheet: '',
      sheetNotes: [],
      lastEventTimestamp: 0,
      presetSongs: [
        {
          id: 'huanlesong',
          title: '欢乐颂',
          keys: 'I I O P P O I U Y Y U I I U U I I O P P O I U Y Y U I U Y Y'
        },
        {
          id: 'xiaoxingxing',
          title: '小星星',
          keys: 'Y Y P P H H P O O I I U U Y P P O O I I U P P O O I I U Y Y P P H H P O O I I U U Y'
        },
        {
          id: 'liangzhilaohu',
          title: '两只老虎',
          keys: 'Y U I Y Y U I Y I O P I O P P H P O I Y P H P O I Y Y P Y Y P Y'
        },
        {
          id: 'shengrikuaile',
          title: '生日快乐',
          keys: 'P P H P K J P P H P L K P P / M K J I , , M K L K'
        }
      ]
    }
  },
  mounted() {
    this.initAutoPlayer()
    this.startStatusUpdate()
  },
  beforeUnmount() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval)
    }
    if (this.autoPlayer) {
      this.autoPlayer.stop()
    }
  },
  watch: {
    keyboard(newVal) {
      if (newVal && !this.autoPlayer) {
        this.initAutoPlayer()
      }
    },
    manualPlayEvent(event) {
      if (!event || !this.hasSheet || !this.showSheet) {
        return
      }
      
      // 防抖：忽略50ms内的重复事件
      const now = Date.now()
      if (event.timestamp && event.timestamp === this.lastEventTimestamp) {
        console.log('⚠️ 重复事件，已忽略')
        return
      }
      this.lastEventTimestamp = event.timestamp
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🎹 按键:', event.key, '时间戳:', event.timestamp)
      console.log('📍 当前琴谱位置:', this.currentIndex)
      
      // 检查当前位置的音符是否匹配
      const currentNote = this.sheetNotes[this.currentIndex]
      console.log('📝 期望音符:', currentNote ? currentNote.key : '无')
      
      if (currentNote && (currentNote.key === event.key || currentNote.note === event.note)) {
        // 匹配！前进到下一个音符
        const oldIndex = this.currentIndex
        
        // 前进到下一个位置
        if (this.currentIndex < this.sheetNotes.length - 1) {
          this.currentIndex++
        } else {
          // 到达末尾，重新开始
          console.log('🎉 完成整首曲子！重新开始')
          this.currentIndex = 0
        }
        
        console.log('✅ 正确！位置:', oldIndex, '→', this.currentIndex)
        const nextNote = this.sheetNotes[this.currentIndex]
        console.log('� 下一个音符:', nextNote ? nextNote.key : '无')
      } else {
        // 不匹配，显示期望的音符
        const expected = currentNote ? currentNote.key : '?'
        console.log('❌ 错误！期望:', expected, '实际:', event.key)
        console.log('💡 提示: 请按', expected, '键')
      }
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    }
  },
  methods: {
    initAutoPlayer() {
      if (this.keyboard) {
        this.autoPlayer = new AutoPlayer(this.keyboard)
        console.log('✅ AutoPlayer initialized')
      }
    },
    togglePanel() {
      this.showPanel = !this.showPanel
    },
    toggleSheet() {
      this.showSheet = !this.showSheet
    },
    loadPreset(song) {
      if (!this.autoPlayer) {
        alert('钢琴还未加载完成，请稍候再试')
        return
      }
      this.autoPlayer.loadFromText(song.keys, 500)
      this.hasSheet = true
      this.currentSong = song.id
      this.currentSongTitle = song.title
      this.updateSheetNotes()
      this.updateStatus()
    },
    loadCustom() {
      if (!this.autoPlayer) {
        alert('钢琴还未加载完成，请稍候再试')
        return
      }
      if (!this.customSheet.trim()) {
        alert('请输入简谱键位')
        return
      }
      this.autoPlayer.loadFromText(this.customSheet, 500)
      this.hasSheet = true
      this.currentSong = null
      this.currentSongTitle = '自定义曲目'
      this.updateSheetNotes()
      this.updateStatus()
    },
    updateSheetNotes() {
      if (!this.autoPlayer) return
      this.sheetNotes = this.autoPlayer.notes || []
    },
    play() {
      if (!this.autoPlayer) {
        alert('钢琴还未加载完成，请稍候再试')
        return
      }
      this.autoPlayer.play()
    },
    pause() {
      if (!this.autoPlayer) return
      this.autoPlayer.pause()
    },
    stop() {
      if (!this.autoPlayer) return
      this.autoPlayer.stop()
      this.updateStatus()
    },
    startStatusUpdate() {
      this.statusInterval = setInterval(() => {
        this.updateStatus()
      }, 100)
    },
    updateStatus() {
      if (!this.autoPlayer) return
      const status = this.autoPlayer.getStatus()
      this.isPlaying = status.isPlaying
      
      // 只在自动播放时更新currentIndex，手动演奏时不覆盖
      if (this.isPlaying) {
        this.currentIndex = status.currentIndex
      }
      
      this.totalNotes = status.totalNotes
      this.progress = parseFloat(status.progress)
    }
  }
}
</script>

<style scoped>
.auto-play-panel {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.panel-toggle {
  background: rgba(0, 0, 0, 0.7);
  color: #fefcb2;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 24px;
  user-select: none;
  transition: background 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.panel-toggle:hover {
  background: rgba(0, 0, 0, 0.9);
}

.panel-content {
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-top: 10px;
  min-width: 350px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(254, 252, 178, 0.3);
}

.panel-content h3 {
  margin: 0 0 15px 0;
  color: #fefcb2;
  font-size: 18px;
  text-align: center;
}

.preset-songs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 15px;
}

.song-btn {
  background: rgba(254, 252, 178, 0.2);
  color: #fefcb2;
  border: 1px solid rgba(254, 252, 178, 0.5);
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.song-btn:hover {
  background: rgba(254, 252, 178, 0.3);
  transform: translateY(-2px);
}

.song-btn.active {
  background: rgba(254, 252, 178, 0.5);
  border-color: #fefcb2;
}

.custom-input {
  margin-bottom: 15px;
}

.custom-input textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(254, 252, 178, 0.3);
  border-radius: 6px;
  padding: 10px;
  font-size: 13px;
  font-family: monospace;
  resize: vertical;
  box-sizing: border-box;
}

.custom-input textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.load-btn {
  width: 100%;
  margin-top: 8px;
  background: rgba(254, 252, 178, 0.3);
  color: #fefcb2;
  border: 1px solid rgba(254, 252, 178, 0.5);
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.load-btn:hover {
  background: rgba(254, 252, 178, 0.4);
}

.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.ctrl-btn {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  border: none;
  transition: all 0.3s;
}

.play-btn {
  background: #4CAF50;
  color: white;
}

.play-btn:hover:not(:disabled) {
  background: #45a049;
}

.pause-btn {
  background: #FF9800;
  color: white;
}

.pause-btn:hover:not(:disabled) {
  background: #e68900;
}

.stop-btn {
  background: #f44336;
  color: white;
}

.stop-btn:hover:not(:disabled) {
  background: #da190b;
}

.ctrl-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.progress {
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fefcb2, #f0e68c);
  transition: width 0.1s linear;
}

.progress-text {
  text-align: center;
  font-size: 12px;
  color: #fefcb2;
  margin-top: 5px;
}

.current-song {
  text-align: center;
  color: #fefcb2;
  font-size: 14px;
  padding: 8px;
  background: rgba(254, 252, 178, 0.1);
  border-radius: 6px;
}

.sheet-toggle {
  margin-bottom: 15px;
}

.sheet-btn {
  width: 100%;
  background: rgba(100, 150, 255, 0.3);
  color: #fefcb2;
  border: 1px solid rgba(100, 150, 255, 0.5);
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.sheet-btn:hover {
  background: rgba(100, 150, 255, 0.4);
  transform: translateY(-2px);
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
