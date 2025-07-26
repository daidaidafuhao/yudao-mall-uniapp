<template>
  <s-layout title="首页" tabbar="/pages/index/index" :bgStyle="bgStyle">
    <!-- 主要内容区域 -->
    <view class="home-container">
      <!-- 顶部背景图 -->
      <view class="top-background">
        <image class="bg-image" src="/static/newImgaes/Mask group (2).png" mode="aspectFill" />
      </view>

      <!-- 用户信息卡片 -->
      <view class="user-card" @tap="onUserCardTap">
        <view class="user-avatar">
          <image 
            v-if="isLogin"
            :src="'/static/newImgaes/Ellipse 219.png'" 
            mode="aspectFill"
            @error="onAvatarError"
          />
          <image 
            v-else 
            :src="'/static/newImgaes/Ellipse 219.png'" 
            mode="aspectFill"
          />
        </view>
        
        <view class="user-info">
          <view class="user-name">{{ isLogin ? userInfo.nickname : '请先登录' }}</view>
        </view>
      </view>

<!-- 主要功能按钮 -->
<view class="main-actions">
  <!-- 堂食按钮 -->
  <view class="action-btn" @tap="onPickup">
    <image class="bg-image" src="/static/newImgaes/Rectangle 46229073.png" mode="aspectFill" />
    <view class="btn-content">
      <image class="btn-icon" src="/static/newImgaes/Mask group.png" mode="aspectFit" />
      <text class="btn-text">堂食</text>
    </view>
  </view>

  <!-- 外送按钮 -->
  <view class="action-btn" @tap="onDelivery">
    <image class="bg-image" src="/static/newImgaes/Rectangle 46229077.png" mode="aspectFill" />
    <view class="btn-content">
      <image class="btn-icon" src="/static/newImgaes/Mask group (1).png" mode="aspectFit" />
      <text class="btn-text">外送</text>
    </view>
  </view>
</view>

      <!-- 功能菜单 -->
      <view class="function-menu">
        <view class="menu-item" @tap="onOrderList">
          <view class="menu-icon">
            <image src="/static/newImgaes/Cooking (烹饪).png" mode="aspectFit" />
          </view>
          <text class="menu-text">订单</text>
        </view>
        
        <view class="menu-item" @tap="onAddressList">
          <view class="menu-icon">
            <image src="/static/newImgaes/Local (已定位).png" mode="aspectFit" />
          </view>
          <text class="menu-text">地址</text>
        </view>
        
        <view class="menu-item" @tap="onUserCenter">
          <view class="menu-icon">
            <image src="/static/newImgaes/People (人员).png" mode="aspectFit" />
          </view>
          <text class="menu-text">我的</text>
        </view>
      </view>
    </view>
  </s-layout>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import sheep from '@/sheep';

// 背景样式 - 纯白色
const bgStyle = {
  color: '#ffffff',
  backgroundImage: 'none'
};

// 用户信息
const userInfo = computed(() => sheep.$store('user').userInfo);
const isLogin = computed(() => sheep.$store('user').isLogin);
const avatarError = reactive({ value: false });

// 头像加载失败处理
const onAvatarError = () => {
  avatarError.value = true;
};

// 堂食功能（自取）
const onPickup = () => {
  // 设置配送方式为自取
  sheep.$store('app').setDeliveryMode('pickup');
  sheep.$router.go('/pages/index/category', { fromHome: true });
};

// 外送功能
const onDelivery = () => {
  // 设置配送方式为外卖
  sheep.$store('app').setDeliveryMode('delivery');
  sheep.$router.go('/pages/index/category', { fromHome: true });
};

// 订单列表
const onOrderList = () => {
  sheep.$router.go('/pages/order/list');
};

// 地址管理
const onAddressList = () => {
  sheep.$router.go('/pages/user/address/list');
};

// 个人中心
const onUserCenter = () => {
  sheep.$router.go('/pages/index/user');
};

// 用户卡片点击
const onUserCardTap = () => {
  if (sheep.$store('user').isLogin) {
    // 已登录，跳转到个人信息页面
    sheep.$router.go('/pages/user/info');
  } else {
    // 未登录，显示登录弹窗
    sheep.$helper.toast('请先登录');
    // 可以在这里调用登录模态框
    // showAuthModal();
  }
};

onLoad(() => {
  // 页面加载时的初始化
  console.log('餐饮主页加载完成');
});
</script>

<style lang="scss" scoped>
// 页面基础样式
page {
  background-color: #ffffff !important;
  height: 100vh;
  overflow: hidden;
}

body {
  background-color: #ffffff !important;
  height: 100vh;
  overflow: hidden;
}

// 主容器
.home-container {
  height: calc(100vh - 50px);
  background-color: #ffffff !important;
  position: relative;
  overflow: hidden;
}

// 顶部背景区域
.top-background {
  position: relative;
  height: 600rpx;
  width: 100%;
  overflow: hidden;
  background-color: #fefcf5;
  
  .bg-image {
    width: 100%;
    height: 100%;
  }
}

// 用户信息卡片
.user-card {
  margin: -80rpx 30rpx 60rpx; // 负边距让卡片向上移动，遮挡背景图
  background: #ffffff;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 10;
  
  .user-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 40rpx;
    overflow: hidden;
    
    image {
      width: 100%;
      height: 100%;
    }
  }
  
  .user-info {
    flex: 1;
    margin-left: 24rpx;
    
    .user-name {
      font-size: 34rpx;
      font-weight: 600;
      color: #333;
      line-height: normal;
    }
  }
}

// 主要功能按钮
.main-actions {
  margin: 40rpx 30rpx 40rpx; // 增加顶部边距，确保与用户卡片不遮挡
  display: flex;
  gap: 2rpx; // 很小的间距，形成分割线
  height: 140rpx; // 降低高度，让按钮更矮
  overflow: visible; // 确保父容器也允许内容超出
  
  .action-btn {
    flex: 1;
    position: relative;
    overflow: visible; // 改为visible，让超出的部分可以显示
    border-radius: 0; // 完全无圆角，保持直角
    
    .bg-image {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }
    
          .btn-content {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        height: 100%;
        padding: 0 16rpx 20rpx; // 移除顶部内边距，让图标可以超出
        
        .btn-icon {
          width: 120rpx; // 进一步扩大图标
          height: 120rpx;
          margin-bottom: 4rpx;
          margin-top: -40rpx; // 增加负边距，让图标向上更多
          transform: translateY(-20rpx); // 增加向上偏移
        }
        
        .btn-text {
          font-size: 24rpx !important;
          color: #333;
          font-weight: 600;
          margin-top: 0; // 移除auto，让文字向上
          transform: translateY(-15rpx); // 让文字也向上移动
        }
      }
    
    // 按下效果
    &:active {
      transform: scale(0.98);
    }
  }
}
// 功能菜单
.function-menu {
  margin: 0 20rpx 20rpx; // 减少底部边距，让按钮更接近底部菜单栏
  display: flex;
  justify-content: space-between;
  gap: 15rpx;
  
  .menu-item {
    flex: 1;
    height: 200rpx; // 进一步增加高度，让按钮更高
    background: #ffffff;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
    
    .menu-icon {
      width: 60rpx; // 扩大图标尺寸
      height: 60rpx; // 扩大图标尺寸
      margin-bottom: 20rpx; // 增加图标与文字的间距
      
      image {
        width: 100%;
        height: 100%;
      }
    }
    
    .menu-text {
      font-size: 26rpx; // 稍微增大字体
      color: #333;
      font-weight: 500;
    }
  }
}

// 隐藏原生tabbar
:deep(.uni-tabbar) {
  display: none !important;
}

// 响应式适配
@media screen and (max-width: 350px) {
  .main-actions .action-btn {
    height: 100rpx;
    
    .btn-icon {
      width: 40rpx;
      height: 40rpx;
    }
    
    .btn-text {
      font-size: 24rpx;
    }
  }
  
  .function-menu .menu-item {
    height: 100rpx;
    
    .menu-icon {
      width: 36rpx;
      height: 28rpx;
    }
    
    .menu-text {
      font-size: 22rpx;
    }
  }
}
</style> 