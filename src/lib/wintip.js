import wintip from 'wintip'
import config from '../config'

wintip.config({
  // 'default', 'info', 'warn', 'error'
  // output: config.isDebug && 'default',  // 如需开启调试信息，取消此行注释
  output: false,  // 默认关闭调试信息
  color: '#fff'
})

export default wintip
