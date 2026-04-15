import wintip from './wintip'

function screenInfo() {
  wintip.$('inner')('inH', window.innerHeight, 'inW', window.innerWidth)
  wintip.$('doc')(
    'dCH',
    document.documentElement.clientHeight,
    'dCW',
    document.documentElement.clientWidth
  )
  wintip.$('body')(
    'bCH',
    document.body.clientHeight,
    'bCW',
    document.body.clientWidth
  )
}

// window.innerHeight 在微信下存在 bug
// 因此使用 documentElement.clientWidth
function getSize() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight
  }
}

function fixOrientation() {
  const clientSize = getSize()
  
  // 始终确保横屏模式：宽度 > 高度
  // 如果当前是竖屏（高度 > 宽度），则交换宽高
  if (clientSize.height > clientSize.width) {
    const info = { 
      width: clientSize.height, 
      height: clientSize.width 
    }
    console.log('横屏模式（交换宽高）:', 'width', info.width, 'height', info.height)
    wintip.$('screen')('横屏,', 'width', info.width, 'height', info.height)
    return info
  } else {
    // 已经是横屏，直接使用
    console.log('横屏模式（保持）:', 'width', clientSize.width, 'height', clientSize.height)
    wintip.$('screen')('横屏,', 'width', clientSize.width, 'height', clientSize.height)
    return clientSize
  }
}

function forceLandscape(clientSize) {
  const info = { height: clientSize.width, width: clientSize.height }

  console.log('force landscape:', 'height', info.height, 'width', info.width)
  wintip.$('screen')('force,', 'height', info.height, 'width', info.width)

  return info
}

function autoOrientation(clientSize) {
  const size = [clientSize.height, clientSize.width].sort((a, b) => a - b)
  const info = { height: size[0], width: size[1] }

  console.log('auto orientation:', 'height', info.height, 'width', info.width)
  wintip.$('screen')('auto,', 'height', info.height, 'width', info.width)

  return info
}

export { getSize as default, screenInfo, fixOrientation }
