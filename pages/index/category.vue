<!-- 商品分类列表 -->
<template>
  <s-layout :bgStyle="{ color: '#fff' }" tabbar="/pages/index/category" title="分类">
    <view class="s-category">
      <view class="three-level-wrap ss-flex ss-col-top">
        <!-- 商品分类（左） -->
        <view class="side-menu-wrap" :style="[{ top: Number(statusBarHeight + 88) + 'rpx' }]">
                     <scroll-view 
             scroll-y 
             :style="[{ height: pageHeight + 'px' }]" 
             :scroll-top="leftScrollTop"
             :scroll-with-animation="true"
             :show-scrollbar="false"
           >
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
        
        <!-- 商品列表（右） - 简单显示 -->
        <view class="goods-list-box" v-if="state.allCategoryGoods.length > 0">
          <scroll-view 
            scroll-y 
            :style="[{ height: pageHeight + 'px' }]"
            :show-scrollbar="false"
          >
            <!-- 只显示当前选中分类的商品 -->
            <view class="single-category-container">
              <!-- 分类标题 -->
              <view class="category-title">{{ state.categoryList[state.activeMenu]?.name }}</view>
              
              <!-- 该分类下的商品 -->
              <view class="goods-list-container" v-if="state.allCategoryGoods[state.activeMenu] && state.allCategoryGoods[state.activeMenu].length > 0">
                <view class="goods-item-wrapper" v-for="item in state.allCategoryGoods[state.activeMenu]" :key="item.id">
                  <view 
                    class="modern-card-wrapper"
                    style="
                      background: #ffffff;
                      border-radius: 20rpx;
                      overflow: hidden;
                      box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.06);
                      border: 2rpx solid #f5f5f5;
                      margin-bottom: 20rpx;
                    "
                  >
                    <s-goods-column
                      class="modern-goods-card"
                      size="lg"
                      :data="item"
                      :topRadius="0"
                      :bottomRadius="0"
                      @click="onGoodsClick(item)"
                    />
                  </view>
                </view>
              </view>
              
              <!-- 无商品提示 -->
              <view v-else class="empty-category">
                <text class="empty-text">该分类暂无商品</text>
              </view>
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

    <!-- 商品SKU选择弹框 -->
    <s-select-sku
      v-if="state.selectedGoods"
      :show="state.showSkuModal"
      :goodsInfo="state.selectedGoods"
      @close="closeSkuModal"
      @addCart="onAddCart"
      @buy="onBuyNow"
    />
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
    // 商品选择弹框相关
    showSkuModal: false,
    selectedGoods: null,
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
      
          // DOM更新完成
    nextTick(() => {
      console.log('所有分类商品加载完成');
    });
    } catch (error) {
      console.error('加载分类商品失败:', error);
    } finally {
      state.loading = false;
    }
  }



  // 点击左侧分类菜单
  function onMenuClick(index) {
    if (state.loading || index === state.activeMenu) return;
    
    state.activeMenu = index;
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





  onLoad(async (params) => {
    await getList();

    // 如果有指定分类ID，找到对应的分类索引
    if (params.id) {
    const foundCategory = state.categoryList.find((category) => category.id === Number(params.id));
      if (foundCategory) {
        state.activeMenu = state.categoryList.indexOf(foundCategory);
      }
    }
    
    // 如果是直接访问分类页面（不是从主页按钮进入），清除配送方式
    if (!params.fromHome) {
      sheep.$store('app').clearDeliveryMode();
    }
    
    // 加载所有分类的商品
    await loadAllCategoryGoods();
  });

  onReady(() => {
    // 页面渲染完成
    console.log('分类页面渲染完成');
  });

  // 商品点击处理
  async function onGoodsClick(goods) {
    try {
      // 获取商品详情信息
      const { code, data } = await SpuApi.getSpuDetail(goods.id);
      if (code === 0) {
        state.selectedGoods = data;
        state.showSkuModal = true;
      }
    } catch (error) {
      console.error('获取商品详情失败:', error);
      sheep.$helper.toast('获取商品信息失败');
    }
  }

  // 关闭SKU选择弹框
  function closeSkuModal() {
    state.showSkuModal = false;
    state.selectedGoods = null;
  }

  // 加入购物车
  function onAddCart(sku) {
    if (!sku.id) {
      sheep.$helper.toast('请选择商品规格');
      return;
    }
    sheep.$store('cart').add(sku);
    closeSkuModal();
  }

  // 立即购买
  function onBuyNow(sku) {
    if (!sku.id) {
      sheep.$helper.toast('请选择商品规格');
      return;
    }
    closeSkuModal();
    // 跳转到订单确认页面
    sheep.$router.go('/pages/order/confirm', {
      data: JSON.stringify({
        items: [{
          skuId: sku.id,
          count: sku.goods_num || 1,
          categoryId: state.selectedGoods?.categoryId,
        }]
      })
    });
  }

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
            padding: 0 10rpx;
            
            .goods-item-wrapper {
              margin-bottom: 20rpx;
              
              &:last-child {
                margin-bottom: 0;
              }
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
