<template>
  <s-layout title="首页" tabbar="/pages/index/index" :bgStyle="bgStyle">
    <!-- 主要内容区域 -->
    <view class="home-container">
      <!-- 顶部背景图 -->
      <view class="top-background">
        <image class="bg-image" src="/static/images/u986.png" mode="aspectFill" />
        
      </view>

      <!-- 用户信息卡片 -->
      <view class="user-card" @tap="onUserCardTap">
        <view class="user-avatar">
          <image 
            v-if="isLogin && !avatarError && userInfo.avatar"
            :src="sheep.$url.cdn(userInfo.avatar)" 
            mode="aspectFill"
            @error="onAvatarError"
          />
          <image 
            v-else 
            :src="sheep.$url.static('/static/img/shop/default_avatar.png')" 
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
        <view class="action-btn dine-in-btn" @tap="onPickup">
            <view class="btn-icon">
            <image src="/static/images/u995.svg" mode="aspectFit" />
            </view>
          <text class="btn-text" style="font-size: 32rpx !important;">堂食</text>
          </view>
          
          <!-- 外送按钮 -->
        <view class="action-btn takeout-btn" @tap="onDelivery">
            <view class="btn-icon">
            <image src="/static/images/微信图片_20250720133229.jpg" mode="aspectFit" />
          </view>
          <text class="btn-text" style="font-size: 32rpx !important;">外送</text>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="function-menu">
        <view class="menu-item" @tap="onOrderList">
          <view class="menu-icon">
            <image src="/static/images/u1009.svg" mode="aspectFit" />
          </view>
          <text class="menu-text">订单</text>
          </view>
          
        <view class="menu-item" @tap="onAddressList">
          <view class="menu-icon">
            <image src="/static/images/u1014.svg" mode="aspectFit" />
          </view>
          <text class="menu-text">地址</text>
        </view>
        
        <view class="menu-item" @tap="onUserCenter">
          <view class="menu-icon">
            <image src="/static/images/u1017.svg" mode="aspectFit" />
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
// 应用原型中的背景效果
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
  background-color: #fefcf5; // 乳白黄色背景
  
  .bg-image {
      width: 100%;
      height: 100%;
    }
  }
  
// 用户信息卡片
.user-card {
  margin: 20rpx 30rpx 40rpx;
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
  margin: 0 30rpx 40rpx;
    display: flex;
  gap: 20rpx;
    
    .action-btn {
      flex: 1;
      height: 160rpx;
    background: #ffffff;
    border-radius: 16rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
      
      .btn-icon {
      width: 80rpx;
      height: 80rpx;
      margin-bottom: 24rpx;
        
        image {
          width: 100%;
          height: 100%;
      }
    }
    
    // 外送按钮特殊图片尺寸
    &.takeout-btn .btn-icon {
      width: 100rpx;
      height: 100rpx;
      margin-bottom: 4rpx; // 进一步减少间距让文字对齐
      
      image {
        width: 100rpx;
        height: 100rpx;
        }
      }
      
      .btn-text {
      font-size: 32rpx !important;
      color: #333;
        font-weight: 600;
    }
  }
}

// 功能菜单
.function-menu {
  margin: 0 20rpx 80rpx;
    display: flex;
  justify-content: space-between;
  gap: 15rpx;
    
    .menu-item {
    flex: 1;
    height: 120rpx;
    background: #ffffff;
    border-radius: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
      
      .menu-icon {
      width: 44rpx;
      height: 32rpx;
        margin-bottom: 16rpx;
        
      image {
        width: 100%;
        height: 100%;
        }
      }
      
      .menu-text {
            font-size: 24rpx;
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