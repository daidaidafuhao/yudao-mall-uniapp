<!-- 装修用户组件：竖排用户卡片 -->
<template>
  <view class="ss-user-vertical-wrap ss-p-t-50" :style="[bgStyle, { marginLeft: `${data.space}px` }]">
    
    <!-- 用户基本信息区域 -->
    <view class="user-basic-info ss-flex ss-col-center ss-row-center ss-m-b-40">
      <view class="avatar-container ss-m-b-20">
        <view class="avatar-box">
          <image class="avatar-img" :src="
              isLogin
                ? sheep.$url.cdn(userInfo.avatar)
                : sheep.$url.static('/static/img/shop/default_avatar.png')"
                 mode="aspectFill" @tap="sheep.$router.go('/pages/user/info')">
          </image>
        </view>
        <view class="avatar-badge" @tap="showShareModal">
          <text class="sicon-qrcode"></text>
        </view>
      </view>
      <view class="user-details ss-text-center">
        <view class="nick-name ss-m-b-10">{{ userInfo?.nickname || nickname }}</view>
        <view class="user-welcome">欢迎来到我们的商城</view>
      </view>
    </view>

    <!-- 装饰性数据展示区域 -->
    <view class="user-stats ss-flex ss-row-between ss-m-b-30">
      <view class="stat-item ss-flex-col ss-row-center ss-col-center">
        <view class="stat-number">{{ userInfo.point || 0 }}</view>
        <view class="stat-label">积分</view>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item ss-flex-col ss-row-center ss-col-center">
        <view class="stat-number">{{ userInfo.mobile ? '已绑定' : '未绑定' }}</view>
        <view class="stat-label">手机号</view>
      </view>
      <view class="stat-divider"></view>
      <view class="stat-item ss-flex-col ss-row-center ss-col-center">
        <view class="stat-number">{{ isLogin ? '已登录' : '未登录' }}</view>
        <view class="stat-label">状态</view>
      </view>
    </view>

    <!-- 快捷功能区域 -->
    <view class="quick-actions">
      <view class="action-item ss-flex ss-row-between ss-col-center" @tap="sheep.$router.go('/pages/order/list')">
        <view class="action-left ss-flex ss-col-center">
          <view class="action-icon order-icon">📋</view>
          <view class="action-text">我的订单</view>
        </view>
        <view class="action-right ss-flex ss-col-center">
          <view class="action-subtitle">查看全部订单</view>
        </view>
      </view>

      <view class="action-item ss-flex ss-row-between ss-col-center" @tap="sheep.$router.go('/pages/user/address/list')">
        <view class="action-left ss-flex ss-col-center">
          <view class="action-icon address-icon">📍</view>
          <view class="action-text">收货地址</view>
        </view>
        <view class="action-right ss-flex ss-col-center">
          <view class="action-subtitle">管理地址</view>
        </view>
      </view>

      <view class="action-item ss-flex ss-row-between ss-col-center" @tap="sheep.$router.go('/pages/user/info')">
        <view class="action-left ss-flex ss-col-center">
          <view class="action-icon profile-icon">👤</view>
          <view class="action-text">个人资料</view>
        </view>
        <view class="action-right ss-flex ss-col-center">
          <view class="action-subtitle">编辑信息</view>
        </view>
      </view>

      <view class="action-item ss-flex ss-row-between ss-col-center" @tap="sheep.$router.go('/pages/public/faq')">
        <view class="action-left ss-flex ss-col-center">
          <view class="action-icon help-icon">❓</view>
          <view class="action-text">帮助中心</view>
        </view>
        <view class="action-right ss-flex ss-col-center">
          <view class="action-subtitle">常见问题</view>
        </view>
      </view>

      <view class="action-item ss-flex ss-row-between ss-col-center" @tap="sheep.$router.go('/pages/public/richtext', { title: '关于我们' })">
        <view class="action-left ss-flex ss-col-center">
          <view class="action-icon about-icon">ℹ️</view>
          <view class="action-text">关于我们</view>
        </view>
        <view class="action-right ss-flex ss-col-center">
          <view class="action-subtitle">了解更多</view>
        </view>
      </view>
    </view>

    <!-- 提示绑定手机号 先隐藏 yudao 需要再修改 -->
    <view
      class="bind-mobile-box ss-flex ss-row-between ss-col-center"
      v-if="false"
    >
      <view class="ss-flex">
        <text class="cicon-mobile-o" />
        <view class="mobile-title ss-m-l-20"> 点击绑定手机号确保账户安全</view>
      </view>
      <button class="ss-reset-button bind-btn" @tap="onBind">去绑定</button>
    </view>
  </view>
</template>

<script setup>
  /**
   * 竖排用户卡片
   *
   * @property {Number} leftSpace                  - 容器左间距
   * @property {Number} rightSpace                  - 容器右间距
   *
   * @property {String} avatar          - 头像
   * @property {String} nickname          - 昵称
   * @property {String} vip              - 等级
   * @property {String} collectNum        - 收藏数
   * @property {String} likeNum          - 点赞数
   *
   *
   */
  import { computed } from 'vue';
  import sheep from '@/sheep';
  import {
    showShareModal,
    showAuthModal,
  } from '@/sheep/hooks/useModal';


  // 用户信息
  const userInfo = computed(() => sheep.$store('user').userInfo);

  // 是否登录
  const isLogin = computed(() => sheep.$store('user').isLogin);
  
  // 接收参数
  const props = defineProps({
    // 装修数据
    data: {
      type: Object,
      default: () => ({}),
    },
    // 装修样式
    styles: {
      type: Object,
      default: () => ({}),
    },
    // 头像
    avatar: {
      type: String,
      default: '',
    },
    nickname: {
      type: String,
      default: '请先登录',
    },

  });

  // 设置背景样式
  const bgStyle = computed(() => {
    // 直接从 props.styles 解构
    const { bgType, bgImg, bgColor } = props.styles;

    // 根据 bgType 返回相应的样式
    return {
      background: bgType === 'img'
        ? `url(${bgImg}) no-repeat top center / 100% 100%`
        : bgColor,
    };
  });

  // 绑定手机号
  function onBind() {
    showAuthModal('changeMobile');
  }
</script>

<style lang="scss" scoped>
  .ss-user-vertical-wrap {
    box-sizing: border-box;
    padding: 0 30rpx;
    min-height: 600rpx;

    // 用户基本信息区域
    .user-basic-info {
      .avatar-container {
        position: relative;
        
        .avatar-box {
          width: 140rpx;
          height: 140rpx;
          border-radius: 50%;
          overflow: hidden;
          border: 6rpx solid #ffffff;
          box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.15);

          .avatar-img {
            width: 100%;
            height: 100%;
          }
        }

        .avatar-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 40rpx;
          height: 40rpx;
          background: linear-gradient(135deg, #ff6b35, #ff8c42);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3rpx solid #ffffff;
          box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.2);

          .sicon-qrcode {
            font-size: 20rpx;
            color: #ffffff;
          }
        }
      }

      .user-details {
        .nick-name {
          font-size: 36rpx;
          font-weight: 600;
          color: #333333;
          line-height: normal;
        }

        .user-welcome {
          font-size: 26rpx;
          color: #666666;
          font-weight: 400;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }
    }

    // 装饰性数据展示区域
    .user-stats {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20rpx;
      padding: 40rpx 20rpx;
      box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.3);

      .stat-item {
        flex: 1;
        cursor: pointer;
        transition: all 0.3s ease;

        &:active {
          transform: scale(0.95);
        }

        .stat-number {
          font-size: 28rpx;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 8rpx;
        }

        .stat-label {
          font-size: 22rpx;
          color: rgba(255, 255, 255, 0.8);
        }
      }

      .stat-divider {
        width: 2rpx;
        height: 50rpx;
        background: rgba(255, 255, 255, 0.3);
        margin: 0 15rpx;
      }
    }

    // 快捷功能区域
    .quick-actions {
      background: #ffffff;
      border-radius: 20rpx;
      overflow: hidden;
      box-shadow: 0 8rpx 25rpx rgba(0, 0, 0, 0.08);

      .action-item {
        padding: 35rpx 25rpx;
        border-bottom: 1rpx solid #f0f0f0;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;

        &:last-child {
          border-bottom: none;
        }

        &:active {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          transform: scale(0.98);
        }

        &::after {
          content: '';
          position: absolute;
          right: 25rpx;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-left: 8rpx solid #cccccc;
          border-top: 6rpx solid transparent;
          border-bottom: 6rpx solid transparent;
        }

        .action-left {
          .action-icon {
            width: 56rpx;
            height: 56rpx;
            border-radius: 16rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28rpx;
            margin-right: 25rpx;
            box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

            &.order-icon {
              background: linear-gradient(135deg, #667eea, #764ba2);
            }

            &.address-icon {
              background: linear-gradient(135deg, #f093fb, #f5576c);
            }

            &.wallet-icon {
              background: linear-gradient(135deg, #4facfe, #00f2fe);
            }

            &.coupon-icon {
              background: linear-gradient(135deg, #43e97b, #38f9d7);
            }

            &.profile-icon {
              background: linear-gradient(135deg, #fa709a, #fee140);
            }

            &.help-icon {
              background: linear-gradient(135deg, #a8edea, #fed6e3);
            }

            &.about-icon {
              background: linear-gradient(135deg, #ffecd2, #fcb69f);
            }
          }

          .action-text {
            font-size: 32rpx;
            font-weight: 600;
            color: #333333;
          }
        }

        .action-right {
          .action-subtitle {
            font-size: 24rpx;
            color: #999999;
            margin-right: 20rpx;
          }
        }
      }
    }

    // 绑定手机号提示框
    .bind-mobile-box {
      width: 100%;
      height: 84rpx;
      padding: 0 34rpx 0 44rpx;
      box-sizing: border-box;
      background: #ffffff;
      box-shadow: 0px -8rpx 9rpx 0px rgba(#e0e0e0, 0.3);
      border-radius: 16rpx;
      margin-top: 20rpx;

      .cicon-mobile-o {
        font-size: 30rpx;
        color: #ff690d;
      }

      .mobile-title {
        font-size: 24rpx;
        font-weight: 500;
        color: #ff690d;
      }

      .bind-btn {
        width: 100rpx;
        height: 50rpx;
        background: #ff6100;
        border-radius: 25rpx;
        font-size: 24rpx;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
</style> 