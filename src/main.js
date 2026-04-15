import './css/style.scss'
import { createApp } from 'vue'
import App from './components/App.vue'

console.log('main.js loaded')
console.log('Vue createApp:', createApp)
console.log('App component:', App)

const app = createApp(App)
console.log('App instance created:', app)

// 添加全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue Error:', err)
  console.error('Component:', instance)
  console.error('Info:', info)
  alert('Vue组件错误: ' + err.message)
}

try {
  app.mount('#app')
  console.log('App mounted to #app')
} catch (err) {
  console.error('Mount error:', err)
  alert('挂载错误: ' + err.message)
}

// 检查挂载后的DOM
setTimeout(() => {
  const appEl = document.getElementById('app')
  console.log('App element:', appEl)
  console.log('App innerHTML length:', appEl?.innerHTML?.length)
  console.log('App children:', appEl?.children)
  console.log('App HTML:', appEl?.innerHTML?.substring(0, 500))
}, 100)
