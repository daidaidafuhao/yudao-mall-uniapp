import request from '@/sheep/request';

const AuthUtil = {
  // 社交授权的跳转
  socialAuthRedirect: (type, redirectUri) => {
    return request({
      url: '/member/auth/social-auth-redirect',
      method: 'GET',
      params: {
        type,
        redirectUri,
      },
      custom: {
        showSuccess: true,
        loadingMsg: '登陆中',
      },
    });
  },
  // 社交快捷登录
  socialLogin: (type, code, state) => {
    return request({
      url: '/member/auth/social-login',
      method: 'POST',
      data: {
        type,
        code,
        state,
      },
      custom: {
        showSuccess: true,
        loadingMsg: '登陆中',
      },
    });
  },
  // 微信小程序的一键登录
  weixinMiniAppLogin: (phoneCode, loginCode, state) => {
    return request({
      url: '/member/auth/weixin-mini-app-login',
      method: 'POST',
      data: {
        phoneCode,
        loginCode,
        state,
      },
      custom: {
        showSuccess: true,
        loadingMsg: '登陆中',
        successMsg: '登录成功',
      },
    });
  },
  // 创建微信 JS SDK 初始化所需的签名
  createWeixinMpJsapiSignature: (url) => {
    return request({
      url: '/member/auth/create-weixin-jsapi-signature',
      method: 'POST',
      params: {
        url,
      },
      custom: {
        showError: false,
        showLoading: false,
      },
    });
  },
  // 登出系统
  logout: () => {
    return request({
      url: '/member/auth/logout',
      method: 'POST',
    });
  },
  // 刷新令牌
  refreshToken: (refreshToken) => {
    return request({
      url: '/member/auth/refresh-token',
      method: 'POST',
      params: {
        refreshToken,
      },
      custom: {
        showLoading: false, // 不用加载中
        showError: false, // 不展示错误提示
      },
    });
  },
};

export default AuthUtil;
