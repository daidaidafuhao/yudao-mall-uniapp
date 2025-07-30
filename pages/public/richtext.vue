<!-- 文章展示 -->
<template>
  <s-layout :bgStyle="{ color: '#FFF' }" :title="state.title" class="set-wrap">
    <view class="ss-p-30 richtext"><mp-html :content="state.content"></mp-html></view>
  </s-layout>
</template>

<script setup>
  import { onLoad } from '@dcloudio/uni-app';
  import { reactive } from 'vue';
  import ArticleApi from '@/sheep/api/promotion/article';

  const state = reactive({
    title: '',
    content: '',
  });

  async function getRichTextContent(id, title) {
    // 如果没有传递id，显示默认内容
    if (!id) {
      state.content = getDefaultContent(title);
      return;
    }
    
    const { code, data } = await ArticleApi.getArticle(id, title);
    if (code !== 0 || !data) {
      // API调用失败或数据为空时，显示默认内容
      state.content = getDefaultContent(title);
      return;
    }
    state.content = data.content;
    // 标题不一致时，修改标题
    if (state.title !== data.title) {
      state.title = data.title;
      uni.setNavigationBarTitle({
        title: state.title,
      });
    }
  }

  // 获取默认内容
  function getDefaultContent(title) {
    if (title === '常见问题' || title === '帮助中心') {
      return `
        <div style="padding: 20px; line-height: 1.6;">
          <h2 style="color: #333; margin-bottom: 20px;">常见问题</h2>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #666; margin-bottom: 10px;">1. 如何注册账号？</h3>
            <p style="color: #999;">点击首页的"登录"按钮，选择注册方式完成账号注册。</p>
          </div>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #666; margin-bottom: 10px;">2. 如何修改个人信息？</h3>
            <p style="color: #999;">进入"我的"页面，点击"个人资料"进行信息修改。</p>
          </div>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #666; margin-bottom: 10px;">3. 如何查看订单？</h3>
            <p style="color: #999;">在"我的"页面点击"我的订单"查看所有订单信息。</p>
          </div>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #666; margin-bottom: 10px;">4. 如何联系客服？</h3>
            <p style="color: #999;">您可以通过客服热线或在线客服与我们联系。</p>
          </div>
        </div>
      `;
    } else if (title === '关于我们') {
      return `
        <div style="padding: 20px; line-height: 1.6;">
          <h2 style="color: #333; margin-bottom: 20px;">关于我们</h2>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #666; margin-bottom: 10px;">公司简介</h3>
            <p style="color: #999;">我们是一家专注于提供优质商品和服务的电商平台，致力于为用户提供便捷的购物体验。</p>
          </div>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #666; margin-bottom: 10px;">我们的使命</h3>
            <p style="color: #999;">为用户提供优质的商品和服务，让购物变得更加简单和愉快。</p>
          </div>
          <div style="margin-bottom: 15px;">
            <h3 style="color: #666; margin-bottom: 10px;">联系方式</h3>
            <p style="color: #999;">客服热线：400-123-4567<br>邮箱：service@example.com<br>地址：某某市某某区某某街道123号</p>
          </div>
        </div>
      `;
    } else {
      return `
        <div style="padding: 20px; text-align: center; color: #999;">
          <h2>内容加载中...</h2>
          <p>请稍后查看</p>
        </div>
      `;
    }
  }

  onLoad((options) => {
    if (options.title) {
      state.title = options.title;
      uni.setNavigationBarTitle({
        title: state.title,
      });
    }
    getRichTextContent(options.id, options.title);
  });
</script>

<style lang="scss" scoped>
  .set-title {
    margin: 0 30rpx;
  }

  :deep() {
    image {
      display: block;
    }
  }
</style>
