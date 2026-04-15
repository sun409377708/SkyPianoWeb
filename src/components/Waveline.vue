<template>
  <div class="waveform" ref="waveform"></div>
</template>

<script>
import Stopwatch from '../lib/Stopwatch'
import SiriWave from '../lib/SiriWave'
import wintip from '../lib/wintip'

export default {
  props: ['amplitude', 'speed', 'width', 'height'],
  data() {
    return {
      wave: null,
      rateTimer: 2000,
      currentSpeed: 0,
      stopwatch: new Stopwatch()
    }
  },
  mounted() {
    this.attachSiriWave()
  },
  // watch: {
  //   width() {
  //     this.$emit('wave:resize')
  //   }
  // },
  methods: {
    attachSiriWave() {
      // Setup the "waveform" animation.
      const wave = new SiriWave({
        container: this.$refs.waveform,
        width: this.width,
        height: 80,
        cover: true,
        color: '#fefcb2',
        speed: this.speed || 0.02,
        amplitude: this.amplitude,
        frequency: 2
        // lerpSpeed: 1
      })

      // 保存wave实例供其他方法使用
      this.wave = wave
    },
    resizeWave() {
      if (!this.wave) return
      
      const { width } = this
      const height = 80

      this.wave.height = height
      this.wave.height_2 = height / 2
      this.wave.MAX = this.wave.height_2 - 4
      this.wave.width = width
      this.wave.width_2 = width / 2
      this.wave.width_4 = width / 4
      this.wave.canvas.height = height
      this.wave.canvas.width = width
      this.wave.container.style.margin = -(height / 2) + 'px auto'
    },
    start() {
      if (this.wave) {
        this.wave.start()
      }
      // 开启心跳监测，计算点击速率
      this.initRateRecord()
    },
    stop() {
      if (this.wave) {
        this.wave.stop()
      }
    },
    setSpeed(val) {
      // 节流
      if (this.currentSpeed === val) return

      if (this.wave && this.wave.setSpeed) {
        this.wave.setSpeed(val)
      }
      this.currentSpeed = val
    },
    setAmplitude(val) {
      if (this.wave && this.wave.setAmplitude) {
        this.wave.setAmplitude(val)
      }
    },
    touch(amplitude) {
      const fps = this.stopwatch.tick().checkBeats('fps', 5)
      const speedRatio = this.heartRate(fps)

      this.setSpeed(this.speed * speedRatio)
    },
    initRateRecord() {
      this.stopwatch.start()

      setInterval(() => {
        const fps = this.stopwatch.emptyFrame().checkBeats('fps', 5)
        const speedRatio = this.heartRate(fps)

        this.setSpeed(this.speed * speedRatio)

        console.log('fps', fps, 'wave', speedRatio)
        wintip.$('rate')('fps', fps, 'wave:', speedRatio)
      }, this.rateTimer)
    },
    heartRate(fps) {
      const maxFps = 5
      const limitVal = 3.5

      if (fps > maxFps) return limitVal

      const val = ((limitVal - 1) / maxFps) * fps + 1

      // range 1 ~ limitVal
      return Number(val.toFixed(3))
    }
  }
}
</script>

<style lang="scss">
.waveform {
  position: absolute;
  bottom: 3vmin;
  left: 0;
  width: 100%;
}
</style>
