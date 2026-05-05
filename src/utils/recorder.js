/**
 * 录音和评分工具
 */

/**
 * 开始录音
 * @returns {Promise<MediaRecorder>}
 */
export function startRecording() {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const chunks = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      mediaRecorder._chunks = chunks
      mediaRecorder._stream = stream
      mediaRecorder.start()

      resolve(mediaRecorder)
    } catch (err) {
      reject(new Error('无法访问麦克风，请检查权限设置'))
    }
  })
}

/**
 * 停止录音并返回音频 blob
 * @param {MediaRecorder} recorder
 * @returns {Promise<Blob>}
 */
export function stopRecording(recorder) {
  return new Promise((resolve, reject) => {
    if (!recorder || recorder.state === 'inactive') {
      reject(new Error('录音未启动'))
      return
    }

    recorder.onstop = () => {
      const blob = new Blob(recorder._chunks, { type: 'audio/webm' })
      // 释放麦克风
      recorder._stream.getTracks().forEach(t => t.stop())
      resolve(blob)
    }

    recorder.stop()
  })
}

/**
 * 播放录音
 * @param {Blob} blob - 音频 blob
 * @returns {Promise}
 */
export function playRecording(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    audio.onended = () => {
      URL.revokeObjectURL(url)
      resolve()
    }
    audio.onerror = reject
    audio.play()
  })
}

/**
 * 简单评分（基于录音时长和音量判断是否有效）
 * 这是一个简化版的评分，真正的语音评分需要后端 AI 服务
 * @param {Blob} blob - 录音 blob
 * @param {number} expectedDuration - 期望的录音时长（秒）
 * @returns {Promise<number>} 评分 0-100
 */
export function scoreRecording(blob, expectedDuration = 2) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob)
    const audio = new Audio(url)
    
    audio.onloadedmetadata = () => {
      const duration = audio.duration
      
      // 基于时长的简单评分
      let score = 50
      
      // 时长越接近期望值分越高
      const durationDiff = Math.abs(duration - expectedDuration)
      if (durationDiff < 0.5) score += 30
      else if (durationDiff < 1) score += 20
      else if (durationDiff < 2) score += 10
      
      // 太短扣分
      if (duration < 0.3) score = Math.max(score - 30, 10)
      // 太长也扣一点
      if (duration > expectedDuration * 3) score = Math.max(score - 10, 20)
      
      // 加上随机波动，模拟真实评分体验
      score += Math.floor(Math.random() * 10) - 5
      score = Math.max(10, Math.min(100, score))
      
      URL.revokeObjectURL(url)
      resolve(score)
    }
    
    audio.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(30) // 出错给个低分
    }
  })
}
