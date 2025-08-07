<!-- 手机号+密码登录组件 -->
<template>
  <view>
    <!-- 标题栏 -->
    <view class="head-box ss-m-b-60 ss-flex-col">
      <view class="ss-flex ss-m-b-20">
        <view class="head-title ss-m-r-40 head-title-animation">{{ isLogin ? '账号登录' : '账号注册' }}</view>
      </view>
      <view class="head-subtitle">{{ isLogin ? '请输入手机号和密码登录' : '请输入手机号和密码注册' }}</view>
    </view>

    <!-- 表单项 -->
    <uni-forms
      ref="accountLoginRef"
      v-model="state.model"
      :rules="rules"
      validateTrigger="bind"
      labelWidth="140"
      labelAlign="center"
    >
      <uni-forms-item name="mobile" label="手机号">
        <uni-easyinput
          v-model="state.model.mobile"
          placeholder="请输入手机号"
          :inputBorder="false"
          maxlength="11"
        />
      </uni-forms-item>
      
      <uni-forms-item name="password" label="密码">
        <uni-easyinput
          v-model="state.model.password"
          type="password"
          :placeholder="isLogin ? '请输入密码' : '请设置密码'"
          :inputBorder="false"
          maxlength="20"
        />
      </uni-forms-item>
      
      <uni-forms-item v-if="!isLogin" name="confirmPassword" label="确认密码">
        <uni-easyinput
          v-model="state.model.confirmPassword"
          type="password"
          placeholder="请再次输入密码"
          :inputBorder="false"
          maxlength="20"
        />
      </uni-forms-item>
      
      <uni-forms-item v-if="!isLogin" name="nickname" label="昵称">
        <uni-easyinput
          v-model="state.model.nickname"
          placeholder="请输入昵称（选填）"
          :inputBorder="false"
          maxlength="20"
        />
      </uni-forms-item>
      
      <!-- 用户协议勾选 -->
      <view class="agreement-box ss-flex ss-flex-col ss-col-center" :class="{ shake: currentProtocol }">
        <view class="agreement-title ss-m-b-20">请选择是否同意以下协议：</view>
        
        <view class="agreement-options-container">
          <!-- 同意选项 -->
          <view class="agreement-option ss-m-b-20">
            <label class="radio ss-flex ss-col-center" @tap="onAgree">
              <radio
                :checked="state.protocol === true"
                color="var(--ui-BG-Main)"
                style="transform: scale(0.8)"
                @tap.stop="onAgree"
              />
              <view class="agreement-text ss-flex ss-col-center ss-m-l-8">
                我已阅读并同意遵守
                <view class="tcp-text" @tap.stop="onProtocol('用户协议')"> 《用户协议》 </view>
                <view class="agreement-text">与</view>
                <view class="tcp-text" @tap.stop="onProtocol('隐私协议')"> 《隐私协议》 </view>
              </view>
            </label>
          </view>
          
          <!-- 拒绝选项 -->
          <view class="agreement-option">
            <label class="radio ss-flex ss-col-center" @tap="onRefuse">
              <radio
                :checked="state.protocol === false"
                color="#ff4d4f"
                style="transform: scale(0.8)"
                @tap.stop="onRefuse"
              />
              <view class="agreement-text ss-flex ss-col-center ss-m-l-8">
                我拒绝遵守
                <view class="tcp-text" @tap.stop="onProtocol('用户协议')"> 《用户协议》 </view>
                <view class="agreement-text">与</view>
                <view class="tcp-text" @tap.stop="onProtocol('隐私协议')"> 《隐私协议》 </view>
              </view>
            </label>
          </view>
        </view>
      </view>
      
      <view class="foot-box">
        <button class="ss-reset-button login-btn" @tap="onSubmit">{{ isLogin ? '登录' : '注册' }}</button>
      </view>
      
      <!-- 切换登录/注册 -->
      <view class="switch-box">
        <text class="switch-text">{{ isLogin ? '还没有账号？' : '已有账号？' }}</text>
        <text class="switch-btn" @tap="switchMode">{{ isLogin ? '立即注册' : '立即登录' }}</text>
      </view>
    </uni-forms>
  </view>
</template>

<script setup>
  import { ref, reactive, computed } from 'vue';
  import sheep from '@/sheep';
  import { closeAuthModal } from '@/sheep/hooks/useModal';
  import AuthUtil from '@/sheep/api/member/auth';
  import { mobile, password } from '@/sheep/validate/form';

  const accountLoginRef = ref(null);
  const currentProtocol = ref(false);
  const isLogin = ref(true); // true为登录，false为注册

  // 数据
  const state = reactive({
    model: {
      mobile: '',
      password: '',
      confirmPassword: '',
      nickname: '', // 新增昵称字段
    },
    protocol: null, // null表示未选择，true表示同意，false表示拒绝
  });

  // 动态验证规则
  const rules = computed(() => {
    const baseRules = {
      mobile,
      password,
    };
    
    if (!isLogin.value) {
      // 注册模式下的验证规则
      baseRules.confirmPassword = [
        {
          required: true,
          errorMessage: '请输入确认密码',
        },
        {
          validateFunction: (rule, value, data, callback) => {
            if (value !== data.password) {
              callback('两次输入的密码不一致');
            }
            return true;
          },
        },
      ];
    }
    
    return baseRules;
  });

  // 同意协议
  function onAgree() {
    state.protocol = true;
  }
  
  // 拒绝协议
  function onRefuse() {
    state.protocol = false;
  }

  // 查看协议
  function onProtocol(title) {
    closeAuthModal();
    sheep.$router.go('/pages/public/richtext', {
      title,
    });
  }

  // 切换登录/注册模式
  function switchMode() {
    isLogin.value = !isLogin.value;
    // 清空表单
    state.model.mobile = '';
    state.model.password = '';
    state.model.confirmPassword = '';
    state.model.nickname = ''; // 清空昵称
    state.protocol = null;
  }

  // 提交
  async function onSubmit() {
    // 检查协议
    if (state.protocol !== true) {
      currentProtocol.value = true;
      setTimeout(() => {
        currentProtocol.value = false;
      }, 1000);
      
      if (state.protocol === false) {
        sheep.$helper.toast('您已拒绝协议，无法继续');
      } else {
        sheep.$helper.toast('请选择是否同意协议');
      }
      return;
    }

    const { model } = state;
    
    if (isLogin.value) {
      // 登录模式：手动验证手机号和密码
      if (!model.mobile) {
        sheep.$helper.toast('请输入手机号');
        return;
      }
      if (!model.password) {
        sheep.$helper.toast('请输入密码');
        return;
      }
      
      // 登录
      const { code } = await AuthUtil.mobilePasswordLogin(model.mobile, model.password);
      if (code === 0) {
        sheep.$helper.toast('登录成功');
        closeAuthModal();
        // 登录成功后刷新用户信息
        await sheep.$store('user').getInfo();
      }
    } else {
      // 注册模式：手动验证所有字段
      if (!model.mobile) {
        sheep.$helper.toast('请输入手机号');
        return;
      }
      if (!model.password) {
        sheep.$helper.toast('请输入密码');
        return;
      }
      if (!model.confirmPassword) {
        sheep.$helper.toast('请输入确认密码');
        return;
      }
      if (model.password !== model.confirmPassword) {
        sheep.$helper.toast('两次输入的密码不一致');
        return;
      }
      
      // 注册
      const { code } = await AuthUtil.mobilePasswordRegister(
        model.mobile, 
        model.password, 
        model.confirmPassword,
        model.nickname
      );
      if (code === 0) {
        sheep.$helper.toast('注册成功');
        closeAuthModal();
        // 注册成功后刷新用户信息
        await sheep.$store('user').getInfo();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../index.scss';

  .foot-box {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 40rpx;
  }
  
  .login-btn {
    width: 686rpx;
    height: 80rpx;
    background-color: var(--ui-BG-Main);
    border-radius: 40rpx;
    color: #fff;
  }

  .switch-box {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30rpx;
  }

  .switch-text {
    font-size: 28rpx;
    color: #999;
  }

  .switch-btn {
    font-size: 28rpx;
    color: var(--ui-BG-Main);
    margin-left: 10rpx;
  }

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