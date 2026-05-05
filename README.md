# 糖果学英语 🍬

> 儿童英语学习平台 - 让学习像吃糖果一样甜蜜

![Vue](https://img.shields.io/badge/Vue-3.x-green) ![Vite](https://img.shields.io/badge/Vite-8.x-blue) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-cyan)

## 快速开始

```bash
cd projects/candy-english
npm install
npm run dev
# 访问 http://localhost:5173
```

## 功能模块

### 1. 用户系统
- ✅ 注册 / 登录
- ✅ 家长密码保护（设置功能需要密码才能进入）

### 2. 首页
- ✅ 今日学习统计（闪卡数、学习分钟、连续天数）
- ✅ 快速入口（闪卡、磨耳朵、看视频、看绘本）
- ✅ 本周学习进度图表

### 3. 闪卡学习
- ✅ 艾宾浩斯遗忘曲线算法加载单词
- ✅ 单词展示：图案 + 发音按钮 + 录音按钮
- ✅ 美式英语标准发音（Web Speech API TTS）
- ✅ 录音评分 + 回放
- ✅ 学习时长和个数统计

### 4. 磨耳朵（音频播放）
- ✅ 资源列表展示
- ✅ 播放速度调节（0.5x - 2.0x）
- ✅ 播放进度记录

### 5. 看视频
- ✅ 视频资源列表
- ✅ 播放进度记录

### 6. 看绘本
- ✅ PDF 阅读器（iframe嵌入）

### 7. 设置（家长管理）
- ✅ 家长密码验证
- ✅ 单词管理（导入内置词库）
- ✅ 资源管理（mp3/mp4/pdf 上传删除）
- ✅ 每日闪卡数量设置
- ✅ 内置词库导入
- ✅ 学习情况查看

## 内置词库

| 词库 | 单词数 |
|------|--------|
| 常见英语单词 100 个 | 100 |
| 一年级上册 | 100 |
| 一年级下册 | 100 |
| 二年级上册 | 100 |
| 二年级下册 | 100 |
| 三年级上册 | 100 |
| 三年级下册 | 100 |
| 四年级上册 | 100 |
| 四年级下册 | 100 |
| 五年级上册 | 100 |
| 五年级下册 | 100 |
| 六年级上册 | 100 |
| 六年级下册 | 100 |

总计：**1600+** 单词

## 技术栈

- **前端**: Vue 3 + Vite + Tailwind CSS 4
- **图标**: FontAwesome 6
- **字体**: Nunito + Noto Sans SC
- **音频**: Web Audio API + MediaRecorder + Speech Synthesis API
- **路由**: Vue Router 4
- **存储**: LocalStorage（可升级到 CloudBase）

## 部署指南

### 本地预览
```bash
npm run dev
```

### 生产构建
```bash
npm run build
# 输出到 dist/ 目录
```

### CloudBase 部署（推荐）

1. 创建 CloudBase 环境：https://console.cloud.tencent.com/tcb
2. 安装 CLI：`npm install -g @cloudbase/cli`
3. 登录并部署：
```bash
tcb login
tcb hosting deploy dist -e your-env-id
```

### 其他平台

- **Vercel**: 直接导入 GitHub 仓库
- **Netlify**: 上传 dist 目录
- **自有服务器**: 上传 dist 目录到任意静态服务器

## 项目结构

```
candy-english/
├── src/
│   ├── views/           # 页面组件
│   │   ├── Home.vue     # 首页
│   │   ├── Login.vue    # 登录
│   │   ├── Register.vue # 注册
│   │   ├── Flashcard.vue # 闪卡学习
│   │   ├── AudioPlayer.vue # 磨耳朵
│   │   ├── VideoPlayer.vue # 看视频
│   │   ├── BookReader.vue  # 看绘本
│   │   └── Settings.vue # 设置管理
│   ├── components/
│   │   └── NavBar.vue   # 底部导航
│   ├── utils/
│   │   ├── spaced-repetition.js # 艾宾浩斯算法
│   │   ├── tts.js       # 文本转语音
│   │   └── recorder.js  # 录音评分
│   ├── data/
│   │   └── word-banks.js # 内置词库（1600+单词）
│   ├── router/index.js  # 路由配置
│   ├── style.css        # Tailwind CSS
│   ├── App.vue          # 根组件
│   └── main.js          # 入口文件
├── index.html
├── vite.config.js
└── package.json
```

## 作者

**乔布斯** - 专业软件开发工程师 😊

## License

MIT