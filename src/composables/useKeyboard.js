/**
 * 键盘映射 Composable
 * 将电脑键盘按键映射到钢琴音符
 */
import { onMounted, onUnmounted } from 'vue'

// 键盘布局映射
// 15个键分为3行，每行5个
const KEY_MAP = {
  // 第一行：y u i o p
  'y': 0,  // C4
  'u': 1,  // D4
  'i': 2,  // E4
  'o': 3,  // F4
  'p': 4,  // G4
  
  // 第二行：h j k l ;
  'h': 5,  // A4
  'j': 6,  // B4
  'k': 7,  // C5
  'l': 8,  // D5
  ';': 9,  // E5
  
  // 第三行：n m , . /
  'n': 10, // F5
  'm': 11, // G5
  ',': 12, // A5
  '.': 13, // B5
  '/': 14  // C6
}

export function useKeyboard(noteList, onKeyPress, onKeyRelease) {
  // 记录当前按下的键，防止重复触发
  const pressedKeys = new Set()

  const handleKeyDown = (event) => {
    // 防止在输入框中触发
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
      return
    }

    const key = event.key.toLowerCase()
    
    // 检查是否是映射的键
    if (key in KEY_MAP && !pressedKeys.has(key)) {
      event.preventDefault()
      pressedKeys.add(key)
      
      const index = KEY_MAP[key]
      if (index < noteList.length) {
        const note = noteList[index].note
        onKeyPress(note)
      }
    }
  }

  const handleKeyUp = (event) => {
    const key = event.key.toLowerCase()
    
    if (key in KEY_MAP && pressedKeys.has(key)) {
      event.preventDefault()
      pressedKeys.delete(key)
      
      const index = KEY_MAP[key]
      if (index < noteList.length) {
        const note = noteList[index].note
        onKeyRelease(note)
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    console.log('键盘映射已启用:', KEY_MAP)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
    pressedKeys.clear()
  })

  return {
    KEY_MAP,
    pressedKeys
  }
}
