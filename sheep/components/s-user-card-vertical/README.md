# 竖排用户卡片组件 (s-user-card-vertical)

## 组件介绍

这是一个基于原有 `s-user-card` 组件开发的竖排用户卡片组件，功能完全一样，但布局改为垂直排列，一行一个功能，界面更加丰富美观。

## 功能特点

- ✅ 用户头像和昵称显示
- ✅ 欢迎语展示
- ✅ 装饰性数据展示（积分、手机号状态、登录状态）
- ✅ 快捷功能菜单（订单、地址、个人资料、帮助中心、关于我们）
- ✅ 二维码分享功能
- ✅ 支持装修模板配置
- ✅ 响应式设计
- ✅ 美观的渐变色彩和阴影效果
- ✅ 饱满的视觉效果设计

## 使用方法

### 1. 在模板中使用

```vue
<template>
  <s-user-card-vertical
    :data="userCardData"
    :styles="userCardStyles"
    :avatar="userInfo.avatar"
    :nickname="userInfo.nickname"
  />
</template>

<script setup>
import sUserCardVertical from '@/sheep/components/s-user-card-vertical';

// 装修数据
const userCardData = {
  space: 0, // 左间距
};

// 装修样式
const userCardStyles = {
  bgType: 'color', // 'img' 或 'color'
  bgColor: '#f8f9fa', // 背景颜色
  // bgImg: 'https://example.com/bg.jpg', // 背景图片
};
</script>
```

### 2. 在装修模板中配置

```javascript
// 装修模板配置示例
{
  "id": "s-user-card-vertical",
  "property": {
    "space": 0,
    "style": {
      "bgType": "color",
      "bgColor": "#f8f9fa"
    }
  }
}
```

## 组件属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| data | Object | {} | 装修数据配置 |
| styles | Object | {} | 装修样式配置 |
| avatar | String | '' | 用户头像 |
| nickname | String | '请先登录' | 用户昵称 |

## 样式配置

### 背景样式 (styles)
- `bgType`: 'img' | 'color' - 背景类型
- `bgColor`: String - 背景颜色
- `bgImg`: String - 背景图片URL

### 间距配置 (data)
- `space`: Number - 左间距（像素）

## 功能区域

### 1. 用户基本信息区域
- 头像（支持点击跳转到个人信息页）
- 昵称显示
- 欢迎语展示
- 二维码分享按钮

### 2. 装饰性数据展示区域
- 用户积分
- 手机号绑定状态
- 登录状态
- 美观的渐变背景设计

### 3. 快捷功能区域
- 我的订单
- 收货地址
- 个人资料
- 帮助中心
- 关于我们
- 每个功能都有对应的图标和描述

## 交互功能

- 点击头像 → 跳转到个人信息编辑页
- 点击二维码 → 显示分享弹窗
- 点击统计数据 → 查看用户状态信息
- 点击功能菜单 → 跳转到对应功能页面
- 支持下拉刷新更新用户数据

## 样式特点

- 现代化的卡片设计
- 渐变色彩搭配
- 圆角和阴影效果
- 响应式布局
- 平滑的交互动画

## 与原组件对比

| 特性 | s-user-card | s-user-card-vertical |
|------|-------------|---------------------|
| 布局方式 | 水平排列 | 垂直排列 |
| 功能数量 | 基础功能 | 简化功能 |
| 视觉效果 | 简洁 | 饱满美观 |
| 信息密度 | 低 | 适中 |
| 交互体验 | 基础 | 增强 |

## 注意事项

1. 确保已正确导入 `fen2yuan` 函数
2. 组件依赖用户状态管理，确保用户数据正确加载
3. 支持装修模板系统，可通过后台配置样式
4. 响应式设计，适配不同屏幕尺寸 