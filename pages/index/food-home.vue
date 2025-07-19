<template>
  <s-layout title="首页" navbar="custom" tabbar="/pages/index/index" :bgStyle="bgStyle" :navbarStyle="navbarStyle">
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
          <image 
            class="user-avatar" 
            :src="userInfo.avatar || defaultAvatar" 
            mode="aspectFill"
          />
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
          <!-- 堂食按钮 -->
          <view class="action-btn dine-in-btn" @tap="onDineIn">
            <view class="btn-icon">
              <image src="/static/images/dine-in-icon.png" mode="aspectFit" />
            </view>
            <text class="btn-text">堂食</text>
          </view>
          
          <!-- 外送按钮 -->
          <view class="action-btn takeout-btn" @tap="onTakeout">
            <view class="btn-icon">
              <image src="/static/images/takeout-icon.png" mode="aspectFit" />
            </view>
            <text class="btn-text">外送</text>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="function-menu">
        <view class="menu-row">
          <view class="menu-item" @tap="onMenuTap('/pages/order/list')">
            <view class="menu-icon order-icon">
              <text class="icon-text">📋</text>
            </view>
            <text class="menu-text">订单记录</text>
          </view>
          
          <view class="menu-item" @tap="onMenuTap('/pages/coupon/list')">
            <view class="menu-icon coupon-icon">
              <text class="icon-text">🎫</text>
            </view>
            <text class="menu-text">优惠券库</text>
          </view>
          
          <view class="menu-item" @tap="onMenuTap('/pages/user/integral')">
            <view class="menu-icon integral-icon">
              <text class="icon-text">🎯</text>
            </view>
            <text class="menu-text">积分明细</text>
          </view>
        </view>
      </view>

      <!-- 推荐商品区域 -->
      <view class="recommended-section">
        <view class="section-title">
          <text class="title-text">今日推荐</text>
          <text class="title-subtitle">为您精选</text>
        </view>
        
        <scroll-view class="goods-scroll" scroll-x show-scrollbar="false">
          <view class="goods-list">
            <view 
              class="goods-item" 
              v-for="item in recommendedGoods" 
              :key="item.id"
              @tap="onGoodsTap(item.id)"
            >
              <image class="goods-image" :src="item.image" mode="aspectFill" />
              <view class="goods-info">
                <text class="goods-name">{{ item.name }}</text>
                <text class="goods-price">¥{{ item.price }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
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

// 状态数据
const state = reactive({
  recommendedGoods: [
    {
      id: 1,
      name: '招牌牛肉面',
      price: '28.00',
      image: '/static/images/beef-noodles.jpg'
    },
    {
      id: 2,
      name: '麻辣香锅',
      price: '35.00',
      image: '/static/images/spicy-hotpot.jpg'
    },
    {
      id: 3,
      name: '宫保鸡丁',
      price: '26.00',
      image: '/static/images/kungpao-chicken.jpg'
    }
  ]
});

// 用户信息
const userInfo = computed(() => sheep.$store('user').userInfo);
const defaultAvatar = '/static/images/default-avatar.png';
const recommendedGoods = computed(() => state.recommendedGoods);

// 堂食功能
const onDineIn = () => {
  uni.showToast({
    title: '堂食功能开发中',
    icon: 'none'
  });
};

// 外送功能
const onTakeout = () => {
  sheep.$router.go('/pages/index/category');
};

// 菜单点击
const onMenuTap = (url) => {
  sheep.$router.go(url);
};

// 商品点击
const onGoodsTap = (goodsId) => {
  sheep.$router.go('/pages/goods/index', { id: goodsId });
};

onLoad(() => {
  // 页面加载时的初始化
  console.log('餐饮主页加载完成');
});
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF5E6 0%, #FFFFFF 50%);
  position: relative;
  overflow: hidden;
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
        
        image {
          width: 100%;
          height: 100%;
          filter: brightness(0) invert(1);
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
        
        &.coupon-icon {
          background: linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%);
        }
        
        &.integral-icon {
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

// 推荐商品区域
.recommended-section {
  margin: 0 40rpx;
  
  .section-title {
    margin-bottom: 32rpx;
    
    .title-text {
      font-size: 36rpx;
      font-weight: 600;
      color: #333;
      margin-right: 16rpx;
    }
    
    .title-subtitle {
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .goods-scroll {
    white-space: nowrap;
    
    .goods-list {
      display: inline-flex;
      gap: 24rpx;
      padding-bottom: 40rpx;
      
      .goods-item {
        width: 200rpx;
        background: #FFFFFF;
        border-radius: 16rpx;
        overflow: hidden;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.06);
        
        .goods-image {
          width: 100%;
          height: 140rpx;
        }
        
        .goods-info {
          padding: 16rpx;
          
          .goods-name {
            font-size: 24rpx;
            color: #333;
            display: block;
            margin-bottom: 8rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .goods-price {
            font-size: 28rpx;
            font-weight: 600;
            color: #FF6B35;
          }
        }
      }
    }
  }
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