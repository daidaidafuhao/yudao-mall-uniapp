<!-- 商品分类列表 -->
<template>
  <s-layout :bgStyle="{ color: '#fff' }" tabbar="/pages/index/category" title="分类">
    <view class="s-category">
      <view class="three-level-wrap ss-flex ss-col-top">
        <!-- 商品分类（左） -->
        <view class="side-menu-wrap" :style="[{ top: Number(statusBarHeight + 88) + 'rpx' }]">
          <scroll-view scroll-y :style="[{ height: pageHeight + 'px' }]" :scroll-top="leftScrollTop">
            <view
              class="menu-item ss-flex"
              v-for="(item, index) in state.categoryList"
              :key="item.id"
              :class="[{ 'menu-item-active': index === state.activeMenu }]"
              @tap="onMenuClick(index)"
            >
              <view class="menu-title ss-line-1">
                {{ item.name }}
              </view>
            </view>
          </scroll-view>
        </view>
        
        <!-- 商品列表（右） -->
        <view class="goods-list-box" v-if="state.allCategoryGoods.length > 0">
          <scroll-view 
            scroll-y 
            :style="[{ height: pageHeight + 'px' }]"
            @scroll="onRightScroll"
            :scroll-top="state.rightScrollTop"
            @scrolltolower="onScrollToLower"
          >
            <!-- 遍历所有分类 -->
            <view 
              v-for="(category, categoryIndex) in state.categoryList" 
              :key="category.id"
              :id="`category-${categoryIndex}`"
              class="category-section"
            >
              <!-- 分类标题 -->
              <view class="category-title">{{ category.name }}</view>
              
              <!-- 该分类下的商品 -->
              <view class="goods-list-container" v-if="state.allCategoryGoods[categoryIndex] && state.allCategoryGoods[categoryIndex].length > 0">
                <view class="goods-item-wrapper" v-for="item in state.allCategoryGoods[categoryIndex]" :key="item.id">
                  <s-goods-column
                    class="goods-card"
                    size="lg"
                    :data="item"
                    :topRadius="10"
                    :bottomRadius="10"
                    @click="sheep.$router.go('/pages/goods/index', { id: item.id })"
                  />
                </view>
              </view>
              
              <!-- 分类无商品提示 -->
              <view v-else class="empty-category">
                <text class="empty-text">该分类暂无商品</text>
              </view>
            </view>
            
            <!-- 加载更多提示 -->
            <view class="load-more-tip" v-if="!state.allLoaded">
              <text>{{ state.loading ? '加载中...' : '已显示全部分类' }}</text>
            </view>
          </scroll-view>
        </view>
        
        <!-- 全局加载状态 -->
        <view v-else-if="state.loading" class="loading-container">
          <text>正在加载商品...</text>
        </view>
        
        <!-- 全局空状态 -->
        <view v-else class="empty-container">
          <s-empty icon="/static/soldout-empty.png" text="暂无商品分类" />
        </view>
      </view>
    </view>
  </s-layout>
</template>

<script setup>
  import sheep from '@/sheep';
  import CategoryApi from '@/sheep/api/product/category';
  import SpuApi from '@/sheep/api/product/spu';
  import { onLoad, onReady } from '@dcloudio/uni-app';
  import { computed, reactive, nextTick } from 'vue';
  import _ from 'lodash-es';
  import { handleTree } from '@/sheep/helper/utils';

  const state = reactive({
    categoryList: [], // 商品分类树
    activeMenu: 0, // 当前高亮的分类
    allCategoryGoods: [], // 所有分类的商品 [分类1商品[], 分类2商品[], ...]
    loading: false,
    allLoaded: false,
    rightScrollTop: 0,
    categoryPositions: [], // 记录每个分类在滚动容器中的位置
    isManualScroll: false, // 是否为手动点击分类触发的滚动
  });

  let leftScrollTop = 0; // 左侧菜单滚动位置

  const { safeArea } = sheep.$platform.device;
  const pageHeight = computed(() => safeArea.height - 44 - 50);
  const statusBarHeight = sheep.$platform.device.statusBarHeight * 2;

  // 加载商品分类
  async function getList() {
    const { code, data } = await CategoryApi.getCategoryList();
    if (code !== 0) {
      return;
    }
    state.categoryList = handleTree(data);
  }

  // 获取指定分类下的所有商品
  async function getCategoryGoods(category) {
    try {
      let allGoods = [];
      
      if (category.children && category.children.length > 0) {
        // 并发请求所有子分类的商品
        const promises = category.children.map(child => 
          SpuApi.getSpuPage({
            categoryId: child.id,
            pageNo: 1,
            pageSize: 50,
          })
        );
        
        const results = await Promise.all(promises);
        
        // 合并所有子分类的商品
        results.forEach(result => {
          if (result.code === 0 && result.data.list) {
            allGoods = allGoods.concat(result.data.list);
          }
        });
      } else {
        // 如果没有子分类，直接获取该分类的商品
        const result = await SpuApi.getSpuPage({
          categoryId: category.id,
          pageNo: 1,
          pageSize: 100,
        });
        
        if (result.code === 0 && result.data.list) {
          allGoods = result.data.list;
        }
      }
      
      return allGoods;
    } catch (error) {
      console.error('获取分类商品失败:', error);
      return [];
    }
  }

  // 加载所有分类的商品
  async function loadAllCategoryGoods() {
    state.loading = true;
    
    try {
      // 并发加载所有分类的商品
      const promises = state.categoryList.map(category => getCategoryGoods(category));
      const results = await Promise.all(promises);
      
      state.allCategoryGoods = results;
      state.allLoaded = true;
      
      // 等待DOM更新后计算各分类位置
      nextTick(() => {
        calculateCategoryPositions();
      });
    } catch (error) {
      console.error('加载分类商品失败:', error);
    } finally {
      state.loading = false;
    }
  }

  // 计算各分类在滚动容器中的位置
  function calculateCategoryPositions() {
    const query = uni.createSelectorQuery();
    state.categoryPositions = [];
    
    state.categoryList.forEach((_, index) => {
      query.select(`#category-${index}`).boundingClientRect((rect) => {
        if (rect) {
          state.categoryPositions[index] = rect.top - (statusBarHeight + 88); // 减去顶部偏移
        }
      });
    });
    
    query.exec();
  }

  // 点击左侧分类菜单
  function onMenuClick(index) {
    if (state.loading) return;
    
    state.isManualScroll = true;
    state.activeMenu = index;
    
    // 滚动到对应分类
    const query = uni.createSelectorQuery();
    query.select(`#category-${index}`).boundingClientRect((rect) => {
      if (rect) {
        state.rightScrollTop = rect.top - (statusBarHeight + 88) + state.rightScrollTop;
      }
      
      // 恢复自动滚动检测
      setTimeout(() => {
        state.isManualScroll = false;
      }, 500);
    });
    query.exec();
    
    // 左侧菜单也要滚动到可视区域
    updateLeftMenuScroll(index);
  }

  // 更新左侧菜单滚动位置
  function updateLeftMenuScroll(activeIndex) {
    const menuItemHeight = 100; // 每个菜单项的高度
    const containerHeight = pageHeight.value;
    const targetPosition = activeIndex * menuItemHeight;
    const offset = containerHeight / 2 - menuItemHeight / 2;
    
    leftScrollTop = Math.max(0, targetPosition - offset);
  }

  // 右侧滚动事件
  function onRightScroll(event) {
    if (state.isManualScroll) return; // 如果是手动点击触发的滚动，不处理
    
    const scrollTop = event.detail.scrollTop;
    
    // 根据滚动位置确定当前应该高亮哪个分类
    let newActiveMenu = 0;
    
    for (let i = state.categoryPositions.length - 1; i >= 0; i--) {
      if (scrollTop >= state.categoryPositions[i] - 50) { // 50px的偏移量
        newActiveMenu = i;
        break;
      }
    }
    
    if (newActiveMenu !== state.activeMenu) {
      state.activeMenu = newActiveMenu;
      updateLeftMenuScroll(newActiveMenu);
    }
  }

  // 滚动到底部
  function onScrollToLower() {
    // 已经显示所有分类，无需加载更多
  }

  onLoad(async (params) => {
    await getList();
    
    // 如果有指定分类ID，找到对应的分类索引
    if (params.id) {
      const foundCategory = state.categoryList.find((category) => category.id === Number(params.id));
      if (foundCategory) {
        state.activeMenu = state.categoryList.indexOf(foundCategory);
      }
    }
    
    // 加载所有分类的商品
    await loadAllCategoryGoods();
  });

  onReady(() => {
    // 页面渲染完成后再次计算位置，确保准确性
    setTimeout(() => {
      calculateCategoryPositions();
    }, 500);
  });
</script>

<style lang="scss" scoped>
  .s-category {
    .three-level-wrap {
      .side-menu-wrap {
        position: fixed;
        left: 0;
        width: 200rpx;
        background: #f8f8f8;
        z-index: 10;
        
        .menu-item {
          height: 100rpx;
          padding: 0 20rpx;
          align-items: center;
          border-bottom: 1rpx solid #eeeeee;
          transition: all 0.3s ease;
          
          &.menu-item-active {
            background: #fff;
            border-right: 4rpx solid var(--ui-BG-Main);
            
            .menu-title {
              color: var(--ui-BG-Main);
              font-weight: bold;
            }
          }
          
          .menu-title {
            font-size: 28rpx;
            color: #666;
            transition: all 0.3s ease;
          }
        }
      }
      
      .goods-list-box {
        margin-left: 200rpx;
        
        .category-section {
          padding: 0 20rpx 40rpx;
          
          .category-title {
            font-size: 32rpx;
            font-weight: bold;
            color: #333;
            text-align: center;
            padding: 30rpx 0;
            position: relative;
            background: #fff;
            sticky: true;
            top: 0;
            z-index: 5;
            
            &::before,
            &::after {
              content: '';
              position: absolute;
              top: 50%;
              width: 60rpx;
              height: 2rpx;
              background: #ddd;
            }
            
            &::before {
              left: 20%;
            }
            
            &::after {
              right: 20%;
            }
          }
          
          .goods-list-container {
            .goods-item-wrapper {
              margin-bottom: 20rpx;
              
              .goods-card {
                width: 100%;
                border-radius: 10rpx;
                overflow: hidden;
                box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
                background: #fff;
              }
            }
            
            .goods-item-wrapper:last-child {
              margin-bottom: 0;
            }
          }
          
          .empty-category {
            padding: 60rpx 0;
            text-align: center;
            
            .empty-text {
              font-size: 28rpx;
              color: #999;
            }
          }
        }
        
        .load-more-tip {
          padding: 40rpx 0;
          text-align: center;
          font-size: 28rpx;
          color: #999;
        }
      }
      
      .loading-container,
      .empty-container {
        margin-left: 200rpx;
        padding: 100rpx 20rpx;
        text-align: center;
        font-size: 28rpx;
        color: #999;
      }
    }
  }
</style>
