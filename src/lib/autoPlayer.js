/**
 * 自动演奏系统
 * 根据简谱JSON自动演奏
 */

class AutoPlayer {
  constructor(keyboard) {
    this.keyboard = keyboard
    this.isPlaying = false
    this.currentIndex = 0
    this.timeoutId = null
    this.notes = []
  }

  /**
   * 加载简谱
   * @param {Object} sheet - 简谱对象 {title, bpm, notes: [{key, duration, note}]}
   */
  loadSheet(sheet) {
    this.notes = sheet.notes || []
    this.title = sheet.title || '未命名'
    this.bpm = sheet.bpm || 120
    console.log(`📝 加载简谱: ${this.title}, 共${this.notes.length}个音符`)
  }

  /**
   * 从JSON文件加载
   */
  async loadFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const sheet = JSON.parse(e.target.result)
          this.loadSheet(sheet)
          resolve(sheet)
        } catch (err) {
          reject(new Error('JSON格式错误: ' + err.message))
        }
      }
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsText(file)
    })
  }

  /**
   * 从简谱文本解析
   * 格式: "Y Y U I I U U | I I O P P O I U"
   */
  loadFromText(text, defaultDuration = 500) {
    const keys = text
      .replace(/\|/g, '') // 移除小节线
      .replace(/\s+/g, ' ') // 统一空格
      .trim()
      .split(' ')
      .filter(k => k.length > 0)

    this.notes = keys.map(key => ({
      key: key.toUpperCase(),
      duration: defaultDuration,
      note: this.keyToNote(key)
    }))

    console.log(`📝 从文本加载: 共${this.notes.length}个音符`)
  }

  /**
   * 键位转音符
   */
  keyToNote(key) {
    const keyMap = {
      'Y': 'C4', 'U': 'D4', 'I': 'E4', 'O': 'F4', 'P': 'G4',
      'H': 'A4', 'J': 'B4', 'K': 'C5', 'L': 'D5', ';': 'E5',
      'N': 'F5', 'M': 'G5', ',': 'A5', '.': 'B5', '/': 'C6'
    }
    return keyMap[key.toUpperCase()] || 'C4'
  }

  /**
   * 开始播放
   */
  play() {
    if (this.isPlaying) {
      console.log('⏸️ 已在播放中')
      return
    }

    if (this.notes.length === 0) {
      console.log('❌ 没有加载简谱')
      return
    }

    this.isPlaying = true
    this.currentIndex = 0
    console.log('▶️ 开始播放')
    this.playNext()
  }

  /**
   * 播放下一个音符
   */
  playNext() {
    if (!this.isPlaying || this.currentIndex >= this.notes.length) {
      this.stop()
      return
    }

    const note = this.notes[this.currentIndex]
    const key = note.key.toLowerCase()

    // 模拟按键按下
    this.keyboard.tapdown(note.note)

    // 延迟后释放按键
    setTimeout(() => {
      this.keyboard.tapup(note.note)
    }, note.duration * 0.8) // 80%的时间按住，20%间隔

    // 播放下一个音符
    this.currentIndex++
    this.timeoutId = setTimeout(() => {
      this.playNext()
    }, note.duration)
  }

  /**
   * 停止播放
   */
  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.isPlaying = false
    this.currentIndex = 0
    console.log('⏹️ 停止播放')
  }

  /**
   * 暂停播放
   */
  pause() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.isPlaying = false
    console.log('⏸️ 暂停播放')
  }

  /**
   * 继续播放
   */
  resume() {
    if (this.currentIndex >= this.notes.length) {
      this.currentIndex = 0
    }
    this.isPlaying = true
    console.log('▶️ 继续播放')
    this.playNext()
  }

  /**
   * 获取播放状态
   */
  getStatus() {
    return {
      isPlaying: this.isPlaying,
      currentIndex: this.currentIndex,
      totalNotes: this.notes.length,
      progress: this.notes.length > 0 ? (this.currentIndex / this.notes.length * 100).toFixed(1) : 0
    }
  }
}

export default AutoPlayer
