<!-- 帮助中心彩蛋页面 -->
<template>
  <s-layout :bgStyle="{ color: '#FFF' }" class="set-wrap" title="帮助中心">
    <view class="easter-egg-container">
      <!-- 彩蛋动画区域 -->
      <view class="egg-animation-area">
        <view class="egg" :class="{ 'egg-cracked': state.eggCracked }" @tap="crackEgg">
          <text class="egg-text">🥚</text>
        </view>
        
        <!-- 彩蛋内容 -->
        <view class="egg-content" v-if="state.eggCracked">
          <view class="surprise-text">🎉 恭喜你发现了彩蛋！</view>
          <view class="message-text">{{ state.currentMessage }}</view>
          <view class="fun-facts">
            <view class="fact-item" v-for="(fact, index) in state.funFacts" :key="index">
              <text class="fact-icon">{{ fact.icon }}</text>
              <text class="fact-text">{{ fact.text }}</text>
            </view>
          </view>
          <view class="action-buttons">
            <button class="fun-btn" @tap="showRandomMessage">再来一个</button>
            <button class="fun-btn" @tap="resetEgg">重新开始</button>
          </view>
        </view>
        
        <!-- 提示文字 -->
        <view class="hint-text" v-if="!state.eggCracked">
          点击彩蛋，发现惊喜！
        </view>
      </view>
      
      <!-- 装饰元素 -->
      <view class="decorations">
        <view class="decoration-item" v-for="i in 6" :key="i" :style="{ animationDelay: i * 0.5 + 's' }">
          {{ ['🌟', '✨', '🎈', '🎊', '🎉', '💫'][i-1] }}
        </view>
      </view>
    </view>
  </s-layout>
</template>

<script setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { reactive } from 'vue';
  import sheep from '@/sheep';

  const state = reactive({
    eggCracked: false,
    currentMessage: '',
    funFacts: [],
    messages: [
      '你真是个好奇宝宝！🎈',
      '发现彩蛋的感觉怎么样？✨',
      '看来你很喜欢探索新功能呢！🌟',
      '恭喜你解锁了隐藏内容！🎊',
      '你比99%的用户都细心！💫',
      '这个彩蛋专门为你准备的！🎉',
      '你的探索精神值得表扬！🏆',
      '看来你是个有趣的人！😄',
      '这个秘密只有你知道！🤫',
      '你发现了我们的隐藏惊喜！🎁'
    ],
    facts: [
      { icon: '🤖', text: '这个页面是用随机生成的' },
      { icon: '🎨', text: '彩蛋模式让帮助更有趣' },
      { icon: '💡', text: '点击按钮可以重新开始' },
      { icon: '🎯', text: '每个彩蛋都是独特的' },
      { icon: '🌈', text: '生活需要一点小惊喜' },
      { icon: '🎪', text: '欢迎来到彩蛋乐园' }
    ]
  });

  // 点击彩蛋
  function crackEgg() {
    if (!state.eggCracked) {
      state.eggCracked = true;
      showRandomMessage();
      showRandomFacts();
      
      // 播放音效（如果支持）
      try {
        const audio = uni.createInnerAudioContext();
        audio.src = 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav';
        audio.play();
      } catch (e) {
        console.log('音效播放失败');
      }
    }
  }

  // 显示随机消息
  function showRandomMessage() {
    const randomIndex = Math.floor(Math.random() * state.messages.length);
    state.currentMessage = state.messages[randomIndex];
  }

  // 显示随机事实
  function showRandomFacts() {
    const shuffled = [...state.facts].sort(() => 0.5 - Math.random());
    state.funFacts = shuffled.slice(0, 3);
  }

  // 重置彩蛋
  function resetEgg() {
    state.eggCracked = false;
    state.currentMessage = '';
    state.funFacts = [];
  }

  onLoad(() => {
    // 彩蛋页面初始化
    console.log('🎉 欢迎来到帮助中心彩蛋页面！');
  });
</script>

<style lang="scss" scoped>
  .easter-egg-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
    position: relative;
    overflow: hidden;
  }

  .egg-animation-area {
    text-align: center;
    z-index: 10;
  }

  .egg {
    width: 200rpx;
    height: 200rpx;
    background: linear-gradient(135deg, #ffecd2, #fcb69f);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 40rpx;
    cursor: pointer;
    transition: all 0.5s ease;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.2);
    animation: eggBounce 2s infinite;

    &:hover {
      transform: scale(1.1);
    }

    &.egg-cracked {
      animation: eggCrack 0.8s ease-out;
      transform: scale(1.2);
    }

    .egg-text {
      font-size: 80rpx;
      animation: eggShake 1s infinite;
    }
  }

  .hint-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 32rpx;
    margin-top: 20rpx;
    animation: pulse 2s infinite;
  }

  .egg-content {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20rpx;
    padding: 40rpx;
    margin-top: 40rpx;
    box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
    animation: slideUp 0.8s ease-out;
  }

  .surprise-text {
    font-size: 36rpx;
    font-weight: bold;
    color: #ff6b35;
    margin-bottom: 20rpx;
    animation: rainbow 3s infinite;
  }

  .message-text {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 30rpx;
    line-height: 1.6;
  }

  .fun-facts {
    margin-bottom: 30rpx;
  }

  .fact-item {
    display: flex;
    align-items: center;
    margin-bottom: 15rpx;
    padding: 15rpx;
    background: linear-gradient(135deg, #f093fb, #f5576c);
    border-radius: 15rpx;
    color: white;
    animation: slideIn 0.5s ease-out;

    .fact-icon {
      font-size: 32rpx;
      margin-right: 15rpx;
    }

    .fact-text {
      font-size: 26rpx;
      flex: 1;
    }
  }

  .action-buttons {
    display: flex;
    gap: 20rpx;
    justify-content: center;
  }

  .fun-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 25rpx;
    padding: 20rpx 30rpx;
    font-size: 26rpx;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2rpx);
      box-shadow: 0 5rpx 15rpx rgba(0, 0, 0, 0.2);
    }
  }

  .decorations {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .decoration-item {
    position: absolute;
    font-size: 40rpx;
    animation: float 3s ease-in-out infinite;

    &:nth-child(1) { top: 10%; left: 10%; animation-delay: 0s; }
    &:nth-child(2) { top: 20%; right: 15%; animation-delay: 0.5s; }
    &:nth-child(3) { top: 60%; left: 5%; animation-delay: 1s; }
    &:nth-child(4) { top: 70%; right: 10%; animation-delay: 1.5s; }
    &:nth-child(5) { top: 40%; left: 20%; animation-delay: 2s; }
    &:nth-child(6) { top: 30%; right: 25%; animation-delay: 2.5s; }
  }

  // 动画定义
  @keyframes eggBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10rpx); }
  }

  @keyframes eggCrack {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1.2); }
  }

  @keyframes eggShake {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(-5deg); }
    75% { transform: rotate(5deg); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(50rpx);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-30rpx);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-20rpx) rotate(10deg); }
  }

  @keyframes rainbow {
    0% { color: #ff6b35; }
    25% { color: #f093fb; }
    50% { color: #667eea; }
    75% { color: #43e97b; }
    100% { color: #ff6b35; }
  }
</style>
