<template>
  <s-layout title="首页" tabbar="/pages/index/index" :bgStyle="bgStyle">
    <!-- 主要内容区域 -->
    <view class="home-container">
      <!-- 顶部背景装饰区域 -->
      <view class="top-section">
        <!-- 厨师插画 -->
        <view class="chef-illustration">
          <image 
            class="chef-img" 
            src="/static/images/chef-cooking.png" 
            mode="aspectFit"
          />
        </view>
        
        <!-- 装饰元素 -->
        <view class="decoration-elements">
          <view class="deco-circle deco-1"></view>
          <view class="deco-circle deco-2"></view>
          <view class="deco-triangle"></view>
        </view>
      </view>

      <!-- 用户信息卡片 -->
      <view class="user-card" v-if="userInfo.nickname">
        <view class="user-info">
          <!-- 头像或默认图标 -->
          <view class="user-avatar">
            <image 
              v-if="!avatarError && userInfo.avatar"
              :src="userInfo.avatar" 
              mode="aspectFill"
              @error="onAvatarError"
            />
            <text v-else class="default-avatar-icon">👤</text>
          </view>
          <view class="user-details">
            <view class="user-name">{{ userInfo.nickname }}</view>
            <view class="user-level">美食会员</view>
          </view>
        </view>
        <view class="points-section">
          <view class="points-item">
            <text class="points-icon">⚡</text>
            <text class="points-text">{{ userInfo.point || 0 }}</text>
          </view>
        </view>
      </view>

      <!-- 主要功能按钮 -->
      <view class="main-actions">
        <view class="action-row">
          <!-- 自取按钮 -->
          <view class="action-btn dine-in-btn" @tap="onPickup">
            <view class="btn-icon">
              <text class="icon-text">🏪</text>
            </view>
            <text class="btn-text">自取</text>
          </view>
          
          <!-- 外卖按钮 -->
          <view class="action-btn takeout-btn" @tap="onDelivery">
            <view class="btn-icon">
              <text class="icon-text">🚁</text>
            </view>
            <text class="btn-text">外卖</text>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="function-menu">
        <view class="menu-row">
          <view class="menu-item" @tap="onMenuTap('/pages/order/list')">
            <view class="menu-icon order-icon">
              <text class="icon-text">📦</text>
            </view>
            <text class="menu-text">订单</text>
          </view>
          
          <view class="menu-item" @tap="onMenuTap('/pages/user/address/list')">
            <view class="menu-icon address-icon">
              <text class="icon-text">📍</text>
            </view>
            <text class="menu-text">地址</text>
          </view>
          
          <view class="menu-item" @tap="onMenuTap('/pages/index/user')">
            <view class="menu-icon user-icon">
              <text class="icon-text">👤</text>
            </view>
            <text class="menu-text">我的</text>
          </view>
        </view>
      </view>


    </view>
  </s-layout>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import sheep from '@/sheep';

// 背景样式
const bgStyle = {
  backgroundColor: '#FFF5E6',
  backgroundImage: ''
};

// 导航栏样式
const navbarStyle = {
  styleType: 'normal',
  bgColor: '#FFF5E6',
  color: '#333'
};

// 用户信息
const userInfo = computed(() => sheep.$store('user').userInfo);
const avatarError = reactive({ value: false });

// 头像加载失败处理
const onAvatarError = () => {
  avatarError.value = true;
};

// 自取功能
const onPickup = () => {
  // 设置配送方式为自取
  sheep.$store('app').setDeliveryMode('pickup');
  sheep.$router.go('/pages/index/category', { fromHome: true });
};

// 外卖功能 
const onDelivery = () => {
  // 设置配送方式为外卖
  sheep.$store('app').setDeliveryMode('delivery');
  sheep.$router.go('/pages/index/category', { fromHome: true });
};

// 菜单点击
const onMenuTap = (url) => {
  sheep.$router.go(url);
};

onLoad(() => {
  // 页面加载时的初始化
  console.log('餐饮主页加载完成');
});
</script>

<style lang="scss" scoped>
.home-container {
  min-height: calc(100vh - 50px); /* 给tabbar留出空间 */
  background: linear-gradient(180deg, #FFF5E6 0%, #FFFFFF 50%);
  position: relative;
  overflow: hidden;
  padding-bottom: 80rpx; /* 额外的底部padding */
}

// 顶部区域
.top-section {
  position: relative;
  height: 300rpx;
  margin-bottom: 40rpx;
  
  .chef-illustration {
    position: absolute;
    top: 20rpx;
    right: 40rpx;
    width: 200rpx;
    height: 200rpx;
    
    .chef-img {
      width: 100%;
      height: 100%;
    }
  }
  
  .decoration-elements {
    .deco-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 183, 77, 0.2);
      
      &.deco-1 {
        width: 60rpx;
        height: 60rpx;
        top: 50rpx;
        left: 60rpx;
      }
      
      &.deco-2 {
        width: 40rpx;
        height: 40rpx;
        top: 160rpx;
        left: 120rpx;
        background: rgba(255, 218, 121, 0.3);
      }
    }
    
    .deco-triangle {
      position: absolute;
      top: 100rpx;
      right: 280rpx;
      width: 0;
      height: 0;
      border-left: 20rpx solid transparent;
      border-right: 20rpx solid transparent;
      border-bottom: 30rpx solid rgba(255, 183, 77, 0.2);
    }
  }
}

// 用户卡片
.user-card {
  margin: 0 40rpx 60rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .user-info {
    display: flex;
    align-items: center;
    
    .user-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 40rpx;
      margin-right: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      
      image {
        width: 100%;
        height: 100%;
        border-radius: 40rpx;
      }
      
      .default-avatar-icon {
        font-size: 40rpx;
        color: #999;
      }
    }
    
    .user-details {
      .user-name {
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 8rpx;
      }
      
      .user-level {
        font-size: 24rpx;
        color: #999;
        background: #FFF5E6;
        padding: 4rpx 16rpx;
        border-radius: 12rpx;
        display: inline-block;
      }
    }
  }
  
  .points-section {
    .points-item {
      display: flex;
      align-items: center;
      background: #FFF5E6;
      padding: 12rpx 20rpx;
      border-radius: 16rpx;
      
      .points-icon {
        font-size: 24rpx;
        margin-right: 8rpx;
      }
      
      .points-text {
        font-size: 28rpx;
        font-weight: 600;
        color: #FF6B35;
      }
    }
  }
}

// 主要功能按钮
.main-actions {
  margin: 0 40rpx 60rpx;
  
  .action-row {
    display: flex;
    gap: 24rpx;
    
    .action-btn {
      flex: 1;
      height: 160rpx;
      border-radius: 24rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      
      &.dine-in-btn {
        background: linear-gradient(135deg, #FFB74D 0%, #FFA726 100%);
        color: white;
      }
      
      &.takeout-btn {
        background: linear-gradient(135deg, #66BB6A 0%, #4CAF50 100%);
        color: white;
      }
      
      .btn-icon {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 16rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .icon-text {
          font-size: 48rpx;
        }
      }
      
      .btn-text {
        font-size: 32rpx;
        font-weight: 600;
      }
      
      &::before {
        content: '';
        position: absolute;
        top: -20rpx;
        right: -20rpx;
        width: 80rpx;
        height: 80rpx;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 50%;
      }
    }
  }
}

// 功能菜单
.function-menu {
  margin: 0 40rpx 60rpx;
  
  .menu-row {
    display: flex;
    justify-content: space-around;
    
    .menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      
      .menu-icon {
        width: 100rpx;
        height: 100rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16rpx;
        
        &.order-icon {
          background: linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%);
        }
        
        &.address-icon {
          background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
        }
        
        &.user-icon {
          background: linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%);
        }
        
        .icon-text {
          font-size: 40rpx;
        }
      }
      
      .menu-text {
        font-size: 24rpx;
        color: #666;
      }
    }
  }
}



// 隐藏原生tabbar
:deep(.uni-tabbar) {
  display: none !important;
}

// 响应式适配
@media screen and (max-width: 350px) {
  .main-actions .action-row .action-btn {
    height: 140rpx;
    
    .btn-icon {
      width: 50rpx;
      height: 50rpx;
    }
    
    .btn-text {
      font-size: 28rpx;
    }
  }
}
</style> 