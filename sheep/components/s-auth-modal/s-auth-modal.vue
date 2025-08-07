<template>
  <!-- 规格弹窗 -->
  <su-popup :show="authType !== ''" round="10" :showClose="true" @close="closeAuthModal">
    <view class="login-wrap">
      <!-- 微信小程序授权 -->
      <mp-authorization v-if="authType === 'mpAuthorization'" />
      
      <!-- 手机号+密码登录 -->
      <account-login v-if="sheep.$platform.name !== 'WechatMiniProgram'" />

      <!-- 第三方登录 -->
      <view class="auto-login-box ss-flex ss-flex-col ss-row-center ss-col-center">
        <!-- 7.1 微信小程序的快捷登录 -->
        <view v-if="sheep.$platform.name === 'WechatMiniProgram'" class="ss-flex register-box">
          <view class="register-title">还没有账号?</view>
          <button
            class="ss-reset-button login-btn"
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
          >
            快捷登录
          </button>
          <view class="circle" />
        </view>

        <!-- 7.3 微信的公众号、App、小程序的登录，基于 openid + code -->
        <button
          v-if="
            ['WechatOfficialAccount', 'WechatMiniProgram', 'App'].includes(sheep.$platform.name) &&
            sheep.$platform.isWechatInstalled
          "
          @tap="thirdLogin('wechat')"
          class="ss-reset-button auto-login-btn"
        >
          <image
            class="auto-login-img"
            :src="sheep.$url.static('/static/img/shop/platform/wechat.png')"
          />
        </button>
      </view>

      <view class="safe-box" />
    </view>
  </su-popup>
</template>

<script setup>
  import { computed, reactive, ref } from 'vue';
  import sheep from '@/sheep';
  import mpAuthorization from './components/mp-authorization.vue';
  import accountLogin from './components/account-login.vue';
  import { closeAuthModal, showAuthModal } from '@/sheep/hooks/useModal';

  const modalStore = sheep.$store('modal');
  // 授权弹窗类型
  const authType = computed(() => modalStore.auth);

  // 显示账号登录
  function showAccountLogin() {
    showAuthModal('accountLogin');
  }

  // 第三方授权登陆（微信）
  const thirdLogin = async (provider) => {
    const loginRes = await sheep.$platform.useProvider(provider).login();
    if (loginRes) {
      const userInfo = await sheep.$store('user').getInfo();
      closeAuthModal();
      // 如果用户已经有头像和昵称，不需要再次授权
      if (userInfo.avatar && userInfo.nickname) {
        return;
      }

      // 触发小程序授权信息弹框
      // #ifdef MP-WEIXIN
      showAuthModal('mpAuthorization');
      // #endif
    }
  };

  // 微信小程序的"手机号快速验证"
  const getPhoneNumber = async (e) => {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      sheep.$helper.toast('快捷登录失败');
      return;
    }
    let result = await sheep.$platform.useProvider().mobileLogin(e.detail);
    if (result) {
      closeAuthModal();
    }
  };
</script>

<style lang="scss" scoped>
  @import './index.scss';

  .shake {
    animation: shake 0.05s linear 4 alternate;
  }

  @keyframes shake {
    from {
      transform: translateX(-10rpx);
    }
    to {
      transform: translateX(10rpx);
    }
  }

  .register-box {
    position: relative;
    justify-content: center;
    .register-btn {
      color: #999999;
      font-size: 30rpx;
      font-weight: 500;
    }
    .register-title {
      color: #999999;
      font-size: 30rpx;
      font-weight: 400;
      margin-right: 24rpx;
    }
    .or-title {
      margin: 0 16rpx;
      color: #999999;
      font-size: 30rpx;
      font-weight: 400;
    }
    .login-btn {
      color: var(--ui-BG-Main);
      font-size: 30rpx;
      font-weight: 500;
    }
    .circle {
      position: absolute;
      right: 0rpx;
      top: 18rpx;
      width: 8rpx;
      height: 8rpx;
      border-radius: 8rpx;
      background: var(--ui-BG-Main);
    }
  }
  .safe-box {
    height: calc(constant(safe-area-inset-bottom) / 5 * 3);
    height: calc(env(safe-area-inset-bottom) / 5 * 3);
  }

  .tcp-text {
    color: var(--ui-BG-Main);
  }

  .agreement-text {
    color: $dark-9;
  }
  
  .agreement-title {
    font-size: 28rpx;
    color: $dark-9;
    text-align: left;
    width: 100%;
    padding-left: 60rpx;
  }
  
  .agreement-options-container {
    width: 100%;
    padding-left: 100rpx;
  }
  
  .agreement-option {
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
</style>
