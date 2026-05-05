/**
 * 文本转语音（TTS）工具 - 美式英语发音
 */

let ttsSupported = false

if (typeof window !== 'undefined' && window.speechSynthesis) {
  ttsSupported = true
}

/**
 * 播放单词发音
 * @param {string} word - 要发音的单词
 * @param {number} rate - 语速 (0.5 - 2.0)，默认 1.0
 * @returns {Promise}
 */
export function speak(word, rate = 1.0) {
  return new Promise((resolve, reject) => {
    if (!ttsSupported) {
      reject(new Error('浏览器不支持语音合成'))
      return
    }

    // 取消正在播放的语音
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    utterance.rate = rate
    utterance.pitch = 1.0

    // 尝试选择美式英语语音
    const voices = window.speechSynthesis.getVoices()
    const usVoice = voices.find(v => v.lang === 'en-US') ||
                    voices.find(v => v.lang.startsWith('en'))
    if (usVoice) {
      utterance.voice = usVoice
    }

    utterance.onend = () => resolve()
    utterance.onerror = (e) => reject(e)

    window.speechSynthesis.speak(utterance)
  })
}

/**
 * 检查 TTS 是否可用
 * @returns {boolean}
 */
export function isTTSSupported() {
  return ttsSupported
}

/**
 * 获取可用语音列表
 * @returns {Array}
 */
export function getVoices() {
  if (!ttsSupported) return []
  return window.speechSynthesis.getVoices().filter(v => v.lang.startsWith('en'))
}
