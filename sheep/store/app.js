import DiyApi from '@/sheep/api/promotion/diy';
import { defineStore } from 'pinia';
import $platform from '@/sheep/platform';
import $router from '@/sheep/router';
import user from './user';
import sys from './sys';
import { baseUrl, h5Url } from '@/sheep/config';

const app = defineStore({
  id: 'app',
  state: () => ({
    info: {
      // 应用信息
      name: '', // 商城名称
      logo: '', // logo
      version: '', // 版本号
      copyright: '', // 版权信息 I
      copytime: '', // 版权信息 II

      cdnurl: '', // 云存储域名
      filesystem: '', // 云存储平台
    },
    platform: {
      share: {
        methods: [], // 支持的分享方式
        forwardInfo: {}, // 默认转发信息
        posterInfo: {}, // 海报信息
        linkAddress: '', // 复制链接地址
      },
      bind_mobile: 0, // 登陆后绑定手机号提醒 (弱提醒，可手动关闭)
    },
    template: {
      // 店铺装修模板
      basic: {}, // 基本信息
      home: {
        // 首页模板
        style: {},
        data: [],
      },
      user: {
        // 个人中心模板
        style: {},
        data: [],
      },
    },
    shareInfo: {}, // 全局分享信息
    has_wechat_trade_managed: 0, // 小程序发货信息管理  0 没有 || 1 有
    deliveryMode: null, // 配送方式：'pickup' 自取, 'delivery' 外卖, null 未选择
  }),
  actions: {
    // 获取Shopro应用配置和模板
    async init(templateId = null) {
      // 检查网络
      const networkStatus = await $platform.checkNetwork();
      if (!networkStatus) {
        $router.error('NetworkError');
      }

      // 检查配置
      if (typeof baseUrl === 'undefined') {
        $router.error('EnvError');
      }

      // 加载装修配置
      await adaptTemplate(this.template, templateId);

      // TODO 芋艿：【初始化优化】未来支持管理后台可配；对应 https://api.shopro.sheepjs.com/shop/api/init
      if (true) {
        this.info = {
          name: '无人机商城',
          logo: 'https://static.iocoder.cn/ruoyi-vue-pro-logo.png',
          version: '2.6.0',
          copyright: '全部开源，个人与企业可 100% 免费使用',
          copytime: 'Copyright© 2018-2025',

          cdnurl: 'https://file.sheepjs.com', // 云存储域名
          filesystem: 'qcloud', // 云存储平台
        };
        this.platform = {
          share: {
            methods: ['forward', 'poster', 'link'],
            linkAddress: h5Url,
            posterInfo: {
              user_bg: '/static/img/shop/config/user-poster-bg.png',
              goods_bg: '/static/img/shop/config/goods-poster-bg.png',
              groupon_bg: '/static/img/shop/config/groupon-poster-bg.png',
            },
            forwardInfo: {
              title: '',
              image: '',
              desc: '',
            },
          },
          bind_mobile: 0,
        };
        this.has_wechat_trade_managed = 0;

        // 加载主题
        const sysStore = sys();
        sysStore.setTheme();

        // 模拟用户登录
        const userStore = user();
        if (userStore.isLogin) {
          userStore.loginAfter();
        }
        return Promise.resolve(true);
      } else {
      }
    },
    
    // 设置配送方式
    setDeliveryMode(mode) {
      this.deliveryMode = mode;
    },
    
    // 获取配送方式
    getDeliveryMode() {
      return this.deliveryMode;
    },
    
    // 清除配送方式
    clearDeliveryMode() {
      this.deliveryMode = null;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'app-store',
      },
    ],
  },
});

const adaptTemplate = async (appTemplate, templateId) => {
  try {
  const { data: diyTemplate } = templateId
    ? // 查询指定模板，一般是预览时使用
      await DiyApi.getDiyTemplate(templateId)
    : await DiyApi.getUsedDiyTemplate();
    
    console.log('装修模板数据:', diyTemplate);
    
  // 模板不存在
  if (!diyTemplate) {
      console.warn('未找到装修模板，使用默认配置');
      // 设置默认 tabbar 配置
      appTemplate.basic.tabbar = {
        style: {
          bgColor: '#ffffff',
          color: '#515151',
          activeColor: '#ff6b35'
        },
        items: [
          {
            text: '首页',
            url: '/pages/index/index',
            iconUrl: 'https://static.iocoder.cn/images/common/wechat_index.png',
            activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_index_active.png'
          },
          {
            text: '分类',
            url: '/pages/index/category',
            iconUrl: 'https://static.iocoder.cn/images/common/wechat_category.png',
            activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_category_active.png'
          },
          {
            text: '购物车',
            url: '/pages/index/cart',
            iconUrl: 'https://static.iocoder.cn/images/common/wechat_cart.png',
            activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_cart_active.png'
          },
          {
            text: '我的',
            url: '/pages/index/user',
            iconUrl: 'https://static.iocoder.cn/images/common/wechat_user.png',
            activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_user_active.png'
          }
        ]
      };
    return;
  }

  const tabBar = diyTemplate?.property?.tabBar;
    console.log('tabBar配置:', tabBar);
    
  if (tabBar) {
    appTemplate.basic.tabbar = tabBar;
    // TODO 商城装修没有对 tabBar 进行角标配置，测试角标需打开以下注释
    // appTemplate.basic.tabbar.items.forEach((tabBar) => {
    //   tabBar.dot = false
    //   tabBar.badge = 100
    // })
    // appTemplate.basic.tabbar.badgeStyle = {
    //   backgroundColor: '#882222',
    // }
    if (tabBar?.theme) {
      appTemplate.basic.theme = tabBar?.theme;
    }
    } else {
      console.warn('模板中未找到tabBar配置，使用默认配置');
      // 设置默认 tabbar 配置
      appTemplate.basic.tabbar = {
        style: {
          bgColor: '#ffffff',
          color: '#515151',
          activeColor: '#ff6b35'
        },
        items: [
          {
            text: '首页',
            url: '/pages/index/index',
            iconUrl: 'https://static.iocoder.cn/images/common/wechat_index.png',
            activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_index_active.png'
          },
          {
            text: '分类',
            url: '/pages/index/category',
            iconUrl: 'https://static.iocoder.cn/images/common/wechat_category.png',
            activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_category_active.png'
          },
          {
            text: '购物车',
            url: '/pages/index/cart',
            iconUrl: 'https://static.iocoder.cn/images/common/wechat_cart.png',
            activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_cart_active.png'
          },
          {
            text: '我的',
            url: '/pages/index/user',
            iconUrl: 'https://static.iocoder.cn/images/common/wechat_user.png',
            activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_user_active.png'
          }
        ]
      };
    }
    
  appTemplate.home = diyTemplate?.home;
  appTemplate.user = diyTemplate?.user;
    
    console.log('最终tabbar配置:', appTemplate.basic.tabbar);
  } catch (error) {
    console.error('加载装修模板失败:', error);
    // 设置默认 tabbar 配置
    appTemplate.basic.tabbar = {
      style: {
        bgColor: '#ffffff',
        color: '#515151',
        activeColor: '#ff6b35'
      },
      items: [
        {
          text: '首页',
          url: '/pages/index/index',
          iconUrl: 'https://static.iocoder.cn/images/common/wechat_index.png',
          activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_index_active.png'
        },
        {
          text: '分类',
          url: '/pages/index/category',
          iconUrl: 'https://static.iocoder.cn/images/common/wechat_category.png',
          activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_category_active.png'
        },
        {
          text: '购物车',
          url: '/pages/index/cart',
          iconUrl: 'https://static.iocoder.cn/images/common/wechat_cart.png',
          activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_cart_active.png'
        },
        {
          text: '我的',
          url: '/pages/index/user',
          iconUrl: 'https://static.iocoder.cn/images/common/wechat_user.png',
          activeIconUrl: 'https://static.iocoder.cn/images/common/wechat_user_active.png'
        }
      ]
    };
  }
};

export default app;
