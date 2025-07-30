# 竖排用户卡片组件配置指南

## 🚀 快速开始

### 1. 组件已注册
✅ 新组件已成功注册到装修系统中
- 组件ID: `UserCardVertical`
- 组件类型: 用户组件
- 已添加到 `s-block-item` 组件中

### 2. 在装修模板中使用

#### 方式一：通过后台装修系统配置

1. **登录管理后台**
   - 进入商城管理后台
   - 找到"装修管理"或"页面装修"

2. **选择个人中心页面**
   - 选择"我的"页面进行装修
   - 或者创建新的自定义页面

3. **添加组件**
   - 在组件库中找到"竖排用户卡片"
   - 拖拽到页面中
   - 或者点击"添加组件"选择"UserCardVertical"

4. **配置组件属性**
   ```json
   {
     "space": 0,
     "style": {
       "bgType": "color",
       "bgColor": "#f8f9fa"
     }
   }
   ```

#### 方式二：直接修改模板配置

在装修模板的 `components` 数组中添加：

```json
{
  "id": "UserCardVertical",
  "property": {
    "space": 0,
    "style": {
      "bgType": "color",
      "bgColor": "#f8f9fa",
      "marginTop": 0,
      "marginBottom": 20,
      "marginLeft": 0,
      "marginRight": 0,
      "paddingTop": 0,
      "paddingBottom": 0,
      "paddingLeft": 0,
      "paddingRight": 0,
      "borderTopLeftRadius": 0,
      "borderTopRightRadius": 0,
      "borderBottomLeftRadius": 0,
      "borderBottomRightRadius": 0
    }
  }
}
```

### 3. 完整模板配置示例

```json
{
  "name": "个人中心模板",
  "type": "user",
  "property": {
    "page": {
      "bgType": "color",
      "bgColor": "#f5f5f5"
    },
    "navigationBar": {
      "bgType": "color",
      "bgColor": "#ffffff",
      "title": "我的",
      "titleColor": "#333333"
    },
    "components": [
      {
        "id": "UserCardVertical",
        "property": {
          "space": 0,
          "style": {
            "bgType": "color",
            "bgColor": "#f8f9fa",
            "marginTop": 0,
            "marginBottom": 20,
            "marginLeft": 0,
            "marginRight": 0,
            "paddingTop": 0,
            "paddingBottom": 0,
            "paddingLeft": 0,
            "paddingRight": 0,
            "borderTopLeftRadius": 0,
            "borderTopRightRadius": 0,
            "borderBottomLeftRadius": 0,
            "borderBottomRightRadius": 0
          }
        }
      },
      {
        "id": "UserOrder",
        "property": {
          "space": 0,
          "style": {
            "bgType": "color",
            "bgColor": "#ffffff",
            "marginTop": 0,
            "marginBottom": 20
          }
        }
      }
    ]
  }
}
```

## 🎨 样式配置选项

### 背景配置
```json
{
  "style": {
    "bgType": "color",        // "color" 或 "img"
    "bgColor": "#f8f9fa",     // 背景颜色（当 bgType 为 "color" 时）
    "bgImg": "https://..."    // 背景图片（当 bgType 为 "img" 时）
  }
}
```

### 间距配置
```json
{
  "style": {
    "marginTop": 0,           // 上边距（像素）
    "marginBottom": 20,       // 下边距（像素）
    "marginLeft": 0,          // 左边距（像素）
    "marginRight": 0,         // 右边距（像素）
    "paddingTop": 0,          // 上内边距（像素）
    "paddingBottom": 0,       // 下内边距（像素）
    "paddingLeft": 0,         // 左内边距（像素）
    "paddingRight": 0         // 右内边距（像素）
  }
}
```

### 圆角配置
```json
{
  "style": {
    "borderTopLeftRadius": 0,     // 左上圆角（像素）
    "borderTopRightRadius": 0,    // 右上圆角（像素）
    "borderBottomLeftRadius": 0,  // 左下圆角（像素）
    "borderBottomRightRadius": 0  // 右下圆角（像素）
  }
}
```

### 组件间距
```json
{
  "space": 0  // 组件内部间距（像素）
}
```

## 🔧 高级配置

### 1. 自定义背景图片
```json
{
  "style": {
    "bgType": "img",
    "bgImg": "https://your-domain.com/background.jpg"
  }
}
```

### 2. 渐变背景效果
```json
{
  "style": {
    "bgType": "color",
    "bgColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  }
}
```

### 3. 卡片式设计
```json
{
  "style": {
    "bgType": "color",
    "bgColor": "#ffffff",
    "marginTop": 10,
    "marginBottom": 10,
    "marginLeft": 15,
    "marginRight": 15,
    "borderTopLeftRadius": 12,
    "borderTopRightRadius": 12,
    "borderBottomLeftRadius": 12,
    "borderBottomRightRadius": 12
  }
}
```

## 📱 响应式设计

组件已内置响应式设计，支持：
- 不同屏幕尺寸适配
- 横竖屏切换
- 小程序、H5、APP 多端兼容

## 🔄 数据更新

组件会自动获取以下数据：
- 用户基本信息（头像、昵称、VIP等级）
- 用户统计数据（收藏、足迹、余额）
- 优惠券数量
- 订单状态

数据更新时机：
- 页面显示时
- 下拉刷新时
- 用户操作后

## 🎯 最佳实践

### 1. 推荐配置
```json
{
  "id": "UserCardVertical",
  "property": {
    "space": 0,
    "style": {
      "bgType": "color",
      "bgColor": "#f8f9fa",
      "marginTop": 0,
      "marginBottom": 20,
      "marginLeft": 15,
      "marginRight": 15,
      "borderTopLeftRadius": 12,
      "borderTopRightRadius": 12,
      "borderBottomLeftRadius": 12,
      "borderBottomRightRadius": 12
    }
  }
}
```

### 2. 与其他组件搭配
- 建议放在页面顶部
- 可以配合 `UserOrder`（用户订单）组件
- 可以配合 `UserWallet`（用户资产）组件
- 可以配合 `MenuList`（菜单列表）组件

### 3. 性能优化
- 组件已优化，支持懒加载
- 图片使用 CDN 加速
- 数据缓存机制

## 🐛 常见问题

### Q: 组件不显示怎么办？
A: 检查以下几点：
1. 确认组件ID为 `UserCardVertical`
2. 确认用户已登录
3. 检查网络连接
4. 查看控制台错误信息

### Q: 样式不生效怎么办？
A: 检查以下几点：
1. 确认样式配置格式正确
2. 确认颜色值格式正确（如 #f8f9fa）
3. 确认数值单位为像素
4. 清除缓存后重试

### Q: 数据不更新怎么办？
A: 检查以下几点：
1. 确认用户登录状态
2. 尝试下拉刷新
3. 检查网络连接
4. 查看API接口是否正常

## 📞 技术支持

如果遇到问题，请：
1. 查看控制台错误信息
2. 检查网络请求状态
3. 确认组件配置正确
4. 联系技术支持团队 