/**
 * 艾宾浩斯遗忘曲线 - 间隔重复算法
 */

// 复习间隔（毫秒）：1天、2天、4天、7天、15天、30天
const INTERVALS = [
  1 * 24 * 60 * 60 * 1000,
  2 * 24 * 60 * 60 * 1000,
  4 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
  15 * 24 * 60 * 60 * 1000,
  30 * 24 * 60 * 60 * 1000
]

/**
 * 计算下次复习时间
 * @param {number} reviewCount - 已复习次数
 * @param {number} score - 录音评分 (0-100)
 * @returns {number} 下次复习时间戳
 */
export function getNextReview(reviewCount, score) {
  // 评分低于 40 分重置到第一间隔
  const effectiveCount = score < 40 ? 0 : reviewCount
  const intervalIndex = Math.min(effectiveCount, INTERVALS.length - 1)
  return Date.now() + INTERVALS[intervalIndex]
}

/**
 * 判断是否需要复习
 * @param {number} nextReview - 下次复习时间戳
 * @returns {boolean}
 */
export function needsReview(nextReview) {
  return Date.now() >= nextReview
}

/**
 * 获取待学习的单词（按优先级排序）
 * 优先级：需要复习的 > 从未学过的 > 其他
 * @param {Array} words - 所有单词列表
 * @param {number} limit - 需要的数量
 * @returns {Array} 待学习的单词
 */
export function getWordsToStudy(words, limit) {
  const now = Date.now()
  
  // 分类
  const needsReview = words.filter(w => w.next_review && w.next_review <= now)
  const newWords = words.filter(w => !w.next_review && !w.last_studied)
  const otherWords = words.filter(w => w.next_review && w.next_review > now)
  
  // 按优先级合并
  let result = [...needsReview, ...newWords]
  
  // 如果不够，随机补充
  if (result.length < limit) {
    const shuffled = [...otherWords].sort(() => Math.random() - 0.5)
    result = [...result, ...shuffled.slice(0, limit - result.length)]
  }
  
  return result.slice(0, limit)
}

/**
 * 获取学习等级文字
 */
export function getLevelText(reviewCount) {
  if (reviewCount === 0) return '新学'
  if (reviewCount === 1) return '初识'
  if (reviewCount === 2) return '熟悉'
  if (reviewCount === 3) return '掌握'
  if (reviewCount >= 4) return '精通'
  return '新学'
}

/**
 * 获取学习等级颜色
 */
export function getLevelColor(reviewCount) {
  if (reviewCount === 0) return '#FF6B6B'
  if (reviewCount === 1) return '#FDCB6E'
  if (reviewCount === 2) return '#FFE66D'
  if (reviewCount === 3) return '#00B894'
  return '#4ECDC4'
}
