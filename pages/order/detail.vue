<!-- 订单详情 -->
<template>
  <s-layout title="订单详情" class="index-wrap" navbar="inner">
    <view
      class="state-box ss-flex-col ss-col-center ss-row-right"
      :style="[
        {
          marginTop: '-' + Number(statusBarHeight + 88) + 'rpx',
          paddingTop: Number(statusBarHeight + 88) + 'rpx',
        },
      ]"
    >
      <view class="ss-flex ss-m-t-32 ss-m-b-20">
        <!-- 待支付 -->
        <image
          v-if="state.orderInfo.status === 0"
          class="state-img"
          :src="sheep.$url.static('/static/img/shop/order/no_pay.png')"
        />
        <!-- 待发货 -->
        <image
          v-if="state.orderInfo.status === 10"
          class="state-img"
          :src="sheep.$url.static('/static/img/shop/order/order_loading.png')"
        />
        <!-- 已完成 -->
        <image
          v-else-if="state.orderInfo.status === 30"
          class="state-img"
          :src="sheep.$url.static('/static/img/shop/order/order_success.png')"
        />
        <!-- 已关闭 -->
        <image
          v-else-if="state.orderInfo.status === 40"
          class="state-img"
          :src="sheep.$url.static('/static/img/shop/order/order_close.png')"
        />
        <!-- 已发货 -->
        <image
          v-else-if="state.orderInfo.status === 20"
          class="state-img"
          :src="sheep.$url.static('/static/img/shop/order/order_express.png')"
        />
        <view class="ss-font-30">{{ formatOrderStatus(state.orderInfo) }}</view>
      </view>
      <view class="ss-font-26 ss-m-x-20 ss-m-b-70">
        {{ formatOrderStatusDescription(state.orderInfo) }}
      </view>
    </view>

    <!-- 收货地址 -->
    <view class="order-address-box" v-if="state.orderInfo.receiverAreaId > 0">
      <view class="ss-flex ss-col-center">
        <text class="address-username">
          {{ state.orderInfo.receiverName }}
        </text>
        <text class="address-phone">{{ state.orderInfo.receiverMobile }}</text>
      </view>
      <view class="address-detail">
        {{ state.orderInfo.receiverAreaName }} {{ state.orderInfo.receiverDetailAddress }}
      </view>
    </view>

    <!-- 无人机配送实时跟踪 -->
    <view 
      class="drone-tracking-box" 
      v-if="state.orderInfo.status === 20 && state.droneInfo"
    >
      <view class="tracking-title">
        <text class="title-text">无人机配送中</text>
        <text class="drone-name">{{ state.droneInfo.droneName }}</text>
      </view>
      
      <!-- 地图组件 -->
      <view class="map-container">
        <map
          v-if="isValidLocation"
          :id="mapId"
          class="delivery-map"
          :longitude="state.mapCenter.longitude"
          :latitude="state.mapCenter.latitude"
          :scale="state.mapScale"
          :markers="state.mapMarkers"
          :polyline="state.mapPolyline"
          show-location
        >
        </map>
        <view v-else class="map-placeholder">
          <text class="placeholder-text">位置信息加载中...</text>
        </view>
      </view>
      
      <!-- 无人机状态信息 -->
      <view class="drone-status">
        <!-- 柜子信息 -->
        <view class="cabinet-info" v-if="state.sourceCabinet || state.targetCabinet">
          <view class="status-row" v-if="state.sourceCabinet">
            <view class="status-item full-width">
              <text class="status-label">起送柜：</text>
              <text class="status-value cabinet-name">{{ state.sourceCabinet.name }} ({{ state.sourceCabinet.code }})</text>
            </view>
          </view>
          <view class="status-row" v-if="state.targetCabinet">
            <view class="status-item full-width">
              <text class="status-label">目标柜：</text>
              <text class="status-value cabinet-name">{{ state.targetCabinet.name }} ({{ state.targetCabinet.code }})</text>
            </view>
          </view>
        </view>
        
        <!-- 无人机状态 -->
        <view class="status-row">
          <view class="status-item">
            <text class="status-label">状态：</text>
            <text class="status-value" :class="getDroneStatusClass()">{{ state.droneInfo.statusDesc }}</text>
          </view>
          <view class="status-item">
            <text class="status-label">电量：</text>
            <text class="status-value">{{ state.droneInfo.batteryLevel }}%</text>
          </view>
        </view>
        <view class="status-row">
          <view class="status-item">
            <text class="status-label">速度：</text>
            <text class="status-value">{{ state.droneInfo.speed }} m/s</text>
          </view>
          <view class="status-item">
            <text class="status-label">高度：</text>
            <text class="status-value">{{ state.droneInfo.altitude }} m</text>
          </view>
        </view>
        <view class="status-row" v-if="state.droneInfo.estimatedArrivalTime">
          <view class="status-item full-width">
            <text class="status-label">预计到达：</text>
            <text class="status-value">{{ formatDateTime(state.droneInfo.estimatedArrivalTime) }}</text>
          </view>
        </view>
      </view>
    </view>

    <view
      class="detail-goods"
      :style="[{ marginTop: state.orderInfo.receiverAreaId > 0 ? '0' : '-40rpx' }]"
    >
      <!-- 订单信 -->
      <view class="order-list" v-for="item in state.orderInfo.items" :key="item.goods_id">
        <view class="order-card">
          <s-goods-item
            @tap="onGoodsDetail(item.spuId)"
            :img="item.picUrl"
            :title="item.spuName"
            :skuText="item.properties.map((property) => property.valueName).join(' ')"
            :price="item.price"
            :num="item.count"
          >
            <template #tool>
              <view class="ss-flex">
                <button
                  class="ss-reset-button apply-btn"
                  v-if="[10, 20, 30].includes(state.orderInfo.status) && item.afterSaleStatus === 0"
                  @tap.stop="
                    sheep.$router.go('/pages/order/aftersale/apply', {
                      orderId: state.orderInfo.id,
                      itemId: item.id,
                    })
                  "
                >
                  申请售后
                </button>
                <button
                  class="ss-reset-button apply-btn"
                  v-if="item.afterSaleStatus === 10"
                  @tap.stop="
                    sheep.$router.go('/pages/order/aftersale/detail', {
                      id: item.afterSaleId,
                    })
                  "
                >
                  退款中
                </button>
                <button
                  class="ss-reset-button apply-btn"
                  v-if="item.afterSaleStatus === 20"
                  @tap.stop="
                    sheep.$router.go('/pages/order/aftersale/detail', {
                      id: item.afterSaleId,
                    })
                  "
                >
                  退款成功
                </button>
              </view>
            </template>
            <template #priceSuffix>
              <button class="ss-reset-button tag-btn" v-if="item.status_text">
                {{ item.status_text }}
              </button>
            </template>
          </s-goods-item>
        </view>
      </view>
    </view>

    <!--  自提核销  -->
    <PickUpVerify
      :order-info="state.orderInfo"
      :systemStore="systemStore"
      ref="pickUpVerifyRef"
    ></PickUpVerify>

    <!-- 订单信息 -->
    <view class="notice-box">
      <view class="notice-box__content">
        <view class="notice-item--center">
          <view class="ss-flex ss-flex-1">
            <text class="title">订单编号：</text>
            <text class="detail">{{ state.orderInfo.no }}</text>
          </view>
          <button class="ss-reset-button copy-btn" @tap="onCopy">复制</button>
        </view>
        <view class="notice-item">
          <text class="title">下单时间：</text>
          <text class="detail">
            {{ sheep.$helper.timeFormat(state.orderInfo.createTime, 'yyyy-mm-dd hh:MM:ss') }}
          </text>
        </view>
        <view class="notice-item" v-if="state.orderInfo.payTime">
          <text class="title">支付时间：</text>
          <text class="detail">
            {{ sheep.$helper.timeFormat(state.orderInfo.payTime, 'yyyy-mm-dd hh:MM:ss') }}
          </text>
        </view>
        <view class="notice-item">
          <text class="title">支付方式：</text>
          <text class="detail">{{ state.orderInfo.payChannelName || '-' }}</text>
        </view>
      </view>
    </view>

    <!-- 价格信息 -->
    <view class="order-price-box">
      <view class="notice-item ss-flex ss-row-between">
        <text class="title">商品总额</text>
        <view class="ss-flex">
          <text class="detail">￥{{ fen2yuan(state.orderInfo.totalPrice) }}</text>
        </view>
      </view>
      <view class="notice-item ss-flex ss-row-between">
        <text class="title">运费</text>
        <text class="detail">￥{{ fen2yuan(state.orderInfo.deliveryPrice) }}</text>
      </view>
      <view class="notice-item ss-flex ss-row-between" v-if="state.orderInfo.couponPrice > 0">
        <text class="title">优惠劵金额</text>
        <text class="detail">-¥{{ fen2yuan(state.orderInfo.couponPrice) }}</text>
      </view>
      <view class="notice-item ss-flex ss-row-between" v-if="state.orderInfo.pointPrice > 0">
        <text class="title">积分抵扣</text>
        <text class="detail">-¥{{ fen2yuan(state.orderInfo.pointPrice) }}</text>
      </view>
      <view class="notice-item ss-flex ss-row-between" v-if="state.orderInfo.discountPrice > 0">
        <text class="title">活动优惠</text>
        <text class="detail">¥{{ fen2yuan(state.orderInfo.discountPrice) }}</text>
      </view>
      <view class="notice-item ss-flex ss-row-between" v-if="state.orderInfo.vipPrice > 0">
        <text class="title">会员优惠</text>
        <text class="detail">-¥{{ fen2yuan(state.orderInfo.vipPrice) }}</text>
      </view>
      <view class="notice-item all-rpice-item ss-flex ss-m-t-20">
        <text class="title">{{ state.orderInfo.payStatus ? '已付款' : '需付款' }}</text>
        <text class="detail all-price">￥{{ fen2yuan(state.orderInfo.payPrice) }}</text>
      </view>
      <view
        class="notice-item all-rpice-item ss-flex ss-m-t-20"
        v-if="state.orderInfo.refundPrice > 0"
      >
        <text class="title">已退款</text>
        <text class="detail all-price">￥{{ fen2yuan(state.orderInfo.refundPrice) }}</text>
      </view>
    </view>

    <!-- 底部按钮 -->
    <!-- TODO: 查看物流、等待成团、评价完后返回页面没刷新页面 -->
    <su-fixed bottom placeholder bg="bg-white" v-if="state.orderInfo.buttons?.length">
      <view class="footer-box ss-flex ss-col-center ss-row-right">
        <button
          class="ss-reset-button cancel-btn"
          v-if="state.orderInfo.buttons?.includes('cancel')"
          @tap="onCancel(state.orderInfo.id)"
        >
          取消订单
        </button>
        <button
          class="ss-reset-button pay-btn ui-BG-Main-Gradient"
          v-if="state.orderInfo.buttons?.includes('pay')"
          @tap="onPay(state.orderInfo.payOrderId)"
        >
          继续支付
        </button>
        <button
          class="ss-reset-button cancel-btn"
          v-if="state.orderInfo.buttons?.includes('combination')"
          @tap="
            sheep.$router.go('/pages/activity/groupon/detail', {
              id: state.orderInfo.combinationRecordId,
            })
          "
        >
          拼团详情
        </button>
        <button
          class="ss-reset-button cancel-btn"
          v-if="state.orderInfo.buttons?.includes('express')"
          @tap="onExpress(state.orderInfo.id)"
        >
          查看物流
        </button>
        <button
          class="ss-reset-button cancel-btn"
          v-if="state.orderInfo.buttons?.includes('confirm')"
          @tap="onConfirm(state.orderInfo.id)"
        >
          确认收货
        </button>
        <button
          class="ss-reset-button cancel-btn"
          v-if="state.orderInfo.buttons?.includes('comment')"
          @tap="onComment(state.orderInfo.id)"
        >
          评价
        </button>
      </view>
    </su-fixed>
  </s-layout>
</template>

<script setup>
  import sheep from '@/sheep';
  import { onLoad, onShow, onUnload, onHide } from '@dcloudio/uni-app';
  import { reactive, ref, computed } from 'vue';
  import { isEmpty } from 'lodash-es';
  import {
    fen2yuan,
    formatOrderStatus,
    formatOrderStatusDescription,
    handleOrderButtons,
  } from '@/sheep/hooks/useGoods';
  import OrderApi from '@/sheep/api/trade/order';
  import DeliveryApi from '@/sheep/api/trade/delivery';
  import DroneApi from '@/sheep/api/delivery/drone';
  import PickUpVerify from '@/pages/order/pickUpVerify.vue';

  const statusBarHeight = sheep.$platform.device.statusBarHeight * 2;
  const headerBg = sheep.$url.css('/static/img/shop/order/order_bg.png');

  const state = reactive({
    orderInfo: {},
    merchantTradeNo: '', // 商户订单号
    comeinType: '', // 进入订单详情的来源类型
    droneInfo: null, // 无人机信息
    mapMarkers: [], // 地图标记
    mapPolyline: [], // 地图路线
    sourceCabinet: null, // 起送柜信息
    targetCabinet: null, // 目标柜信息
    mapCenter: { latitude: 0, longitude: 0 }, // 地图中心点
    mapScale: 13, // 地图缩放级别
  });

  const mapId = 'droneMap' + Date.now(); // 地图ID
  let droneUpdateTimer = null; // 无人机信息更新定时器

  // 验证坐标是否有效
  const isValidLocation = computed(() => {
    if (!state.droneInfo) return false;
    
    const lat = parseFloat(state.droneInfo.latitude);
    const lng = parseFloat(state.droneInfo.longitude);
    
    // 检查是否为有效数字且在合理范围内
    const isValidLat = !isNaN(lat) && lat >= -90 && lat <= 90;
    const isValidLng = !isNaN(lng) && lng >= -180 && lng <= 180;
    
    return isValidLat && isValidLng;
  });

  // 安全的纬度值
  const validLatitude = computed(() => {
    if (!isValidLocation.value) return 0;
    return parseFloat(state.droneInfo.latitude);
  });

  // 安全的经度值
  const validLongitude = computed(() => {
    if (!isValidLocation.value) return 0;
    return parseFloat(state.droneInfo.longitude);
  });

  // ========== 门店自提（核销） ==========
  const systemStore = ref({}); // 门店信息

  // 复制
  const onCopy = () => {
    sheep.$helper.copyText(state.orderInfo.no);
  };

  // 去支付
  function onPay(payOrderId) {
    sheep.$router.go('/pages/pay/index', {
      id: payOrderId,
    });
  }

  // 查看商品
  function onGoodsDetail(id) {
    sheep.$router.go('/pages/goods/index', {
      id,
    });
  }

  // 取消订单
  async function onCancel(orderId) {
    uni.showModal({
      title: '提示',
      content: '确定要取消订单吗?',
      success: async function (res) {
        if (!res.confirm) {
          return;
        }
        const { code } = await OrderApi.cancelOrder(orderId);
        if (code === 0) {
          await getOrderDetail(orderId);
        }
      },
    });
  }

  // 查看物流
  async function onExpress(id) {
    sheep.$router.go('/pages/order/express/log', {
      id,
    });
  }

  // 确认收货
  async function onConfirm(orderId, ignore = false) {
    // 需开启确认收货组件
    // todo: 芋艿：【微信物流】待接入微信 https://gitee.com/sheepjs/shopro-uniapp/commit/a6bbba49b84dd418b84c5fefc8b7463df8f4901f
    // 1.怎么检测是否开启了发货组件功能？如果没有开启的话就不能在这里return出去
    // 2.如果开启了走mpConfirm方法,需要在App.vue的show方法中拿到确认收货结果
    let isOpenBusinessView = true;
    if (
      sheep.$platform.name === 'WechatMiniProgram' &&
      !isEmpty(state.orderInfo.wechat_extra_data) &&
      isOpenBusinessView &&
      !ignore
    ) {
      mpConfirm(orderId);
      return;
    }

    uni.showModal({
      title: '提示',
      content: '确认收货吗？',
      success: async function (res) {
        if (!res.confirm) {
          return;
        }
        // 正常的确认收货流程
        const { code } = await OrderApi.receiveOrder(orderId);
        if (code === 0) {
          await getOrderDetail(orderId);
        }
      },
    });
  }

  // #ifdef MP-WEIXIN
  // 小程序确认收货组件
  function mpConfirm(orderId) {
    if (!wx.openBusinessView) {
      sheep.$helper.toast(`请升级微信版本`);
      return;
    }
    wx.openBusinessView({
      businessType: 'weappOrderConfirm',
      extraData: {
        merchant_trade_no: state.orderInfo.wechat_extra_data.merchant_trade_no,
        transaction_id: state.orderInfo.wechat_extra_data.transaction_id,
      },
      success(response) {
        console.log('success:', response);
        if (response.errMsg === 'openBusinessView:ok') {
          if (response.extraData.status === 'success') {
            onConfirm(orderId, true);
          }
        }
      },
      fail(error) {
        console.log('error:', error);
      },
      complete(result) {
        console.log('result:', result);
      },
    });
  }

  // #endif

  // 评价
  function onComment(id) {
    sheep.$router.go('/pages/goods/comment/add', {
      id,
    });
  }

  // 获取无人机信息
  async function getDroneInfo(orderNo) {
    try {
      const { code, data } = await DroneApi.getDroneByOrder(orderNo);
      if (code === 0 && data) {
        // 验证坐标数据
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        
        if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          console.warn('无人机坐标数据无效:', { latitude: data.latitude, longitude: data.longitude });
          // 使用默认坐标（可以设置为商店位置或城市中心）
          data.latitude = 39.9042; // 北京天安门纬度
          data.longitude = 116.4074; // 北京天安门经度
        }
        
        state.droneInfo = data;
        
        // 获取起送柜和目标柜信息
        await getCabinetInfo();
        
        // 更新地图显示
        updateMapView();
        return true;
      }
    } catch (error) {
      console.error('获取无人机信息失败:', error);
    }
    return false;
  }

  // 获取柜子信息
  async function getCabinetInfo() {
    if (!state.droneInfo) return;
    if (!state.droneInfo.sourceCabinetCode && !state.droneInfo.targetCabinetCode) return;

    try {
      // 搜索柜子的函数
      const searchCabinets = async (latitude, longitude, limit = 100) => {
        const { code, data } = await DroneApi.getNearestCabinetList({
          latitude,
          longitude,
          limit
        });
        return code === 0 ? data || [] : [];
      };

      // 首先使用无人机当前位置搜索
      let allCabinets = await searchCabinets(validLatitude.value, validLongitude.value, 100);
      
      // 如果找不到需要的柜子，尝试使用一些常见城市中心位置扩大搜索范围
      const targetCodes = [state.droneInfo.sourceCabinetCode, state.droneInfo.targetCabinetCode].filter(Boolean);
      const foundCodes = allCabinets.map(c => c.code || c.id);
      const missingCodes = targetCodes.filter(code => !foundCodes.includes(code));
      
      if (missingCodes.length > 0) {
        console.log('部分柜子未找到，扩大搜索范围:', missingCodes);
        
        // 尝试一些备用搜索位置（常见城市中心）
        const backupLocations = [
          { lat: 39.9042, lng: 116.4074 }, // 北京
          { lat: 31.2304, lng: 121.4737 }, // 上海
          { lat: 22.5431, lng: 114.0579 }, // 深圳
          { lat: 23.1291, lng: 113.2644 }, // 广州
        ];
        
        for (const location of backupLocations) {
          if (missingCodes.length === 0) break;
          
          const moreCabinets = await searchCabinets(location.lat, location.lng, 200);
          allCabinets = [...allCabinets, ...moreCabinets];
          
          // 检查是否找到了缺失的柜子
          const newFoundCodes = moreCabinets.map(c => c.code || c.id);
          missingCodes.splice(0, missingCodes.length, ...missingCodes.filter(code => !newFoundCodes.includes(code)));
        }
      }

      // 去重（根据code或id）
      const uniqueCabinets = allCabinets.filter((cabinet, index, self) => 
        index === self.findIndex(c => (c.code || c.id) === (cabinet.code || cabinet.id))
      );

      // 根据编号筛选起送柜
      if (state.droneInfo.sourceCabinetCode) {
        const sourceCabinet = uniqueCabinets.find(cabinet => 
          cabinet.code === state.droneInfo.sourceCabinetCode ||
          cabinet.id === state.droneInfo.sourceCabinetCode
        );
        if (sourceCabinet) {
          state.sourceCabinet = sourceCabinet;
          console.log('找到起送柜:', sourceCabinet);
        } else {
          console.warn('未找到起送柜:', state.droneInfo.sourceCabinetCode);
        }
      }

      // 根据编号筛选目标柜
      if (state.droneInfo.targetCabinetCode) {
        const targetCabinet = uniqueCabinets.find(cabinet => 
          cabinet.code === state.droneInfo.targetCabinetCode ||
          cabinet.id === state.droneInfo.targetCabinetCode
        );
        if (targetCabinet) {
          state.targetCabinet = targetCabinet;
          console.log('找到目标柜:', targetCabinet);
        } else {
          console.warn('未找到目标柜:', state.droneInfo.targetCabinetCode);
        }
      }

      console.log(`共搜索到 ${uniqueCabinets.length} 个柜子，起送柜: ${state.sourceCabinet ? '✓' : '✗'}，目标柜: ${state.targetCabinet ? '✓' : '✗'}`);
      
    } catch (error) {
      console.error('获取柜子信息失败:', error);
    }
  }

  // 更新地图视图（标记、路线、视角）
  function updateMapView() {
    if (!state.droneInfo || !isValidLocation.value) return;

    const markers = [];
    const polylinePoints = [];

    // 1. 起送柜标记
    if (state.sourceCabinet && state.sourceCabinet.latitude && state.sourceCabinet.longitude) {
      markers.push({
        id: 'source',
        latitude: parseFloat(state.sourceCabinet.latitude),
        longitude: parseFloat(state.sourceCabinet.longitude),
        iconPath: '/static/cabinet-source-icon.png',
        width: 35,
        height: 35,
        title: '起送柜',
        callout: {
          content: `起送柜: ${state.sourceCabinet.name}`,
          fontSize: 12,
          borderRadius: 5,
          padding: 5,
          bgColor: '#4CAF50',
          color: '#FFFFFF'
        }
      });
      polylinePoints.push({
        latitude: parseFloat(state.sourceCabinet.latitude),
        longitude: parseFloat(state.sourceCabinet.longitude)
      });
    }

    // 2. 无人机当前位置标记
    markers.push({
      id: 'drone',
      latitude: validLatitude.value,
      longitude: validLongitude.value,
      iconPath: '/static/drone-icon.png',
      width: 40,
      height: 40,
      title: state.droneInfo.droneName,
      callout: {
        content: `${state.droneInfo.statusDesc} | 电量: ${state.droneInfo.batteryLevel}%`,
        fontSize: 12,
        borderRadius: 5,
        padding: 5,
        bgColor: '#2196F3',
        color: '#FFFFFF',
        display: 'ALWAYS'
      }
    });
    polylinePoints.push({
      latitude: validLatitude.value,
      longitude: validLongitude.value
    });

    // 3. 目标柜标记
    if (state.targetCabinet && state.targetCabinet.latitude && state.targetCabinet.longitude) {
      markers.push({
        id: 'target',
        latitude: parseFloat(state.targetCabinet.latitude),
        longitude: parseFloat(state.targetCabinet.longitude),
        iconPath: '/static/cabinet-target-icon.png',
        width: 35,
        height: 35,
        title: '目标柜',
        callout: {
          content: `目标柜: ${state.targetCabinet.name}`,
          fontSize: 12,
          borderRadius: 5,
          padding: 5,
          bgColor: '#FF9800',
          color: '#FFFFFF'
        }
      });
      polylinePoints.push({
        latitude: parseFloat(state.targetCabinet.latitude),
        longitude: parseFloat(state.targetCabinet.longitude)
      });
    }

    // 更新标记
    state.mapMarkers = markers;

    // 更新路线（连接三个点）
    if (polylinePoints.length >= 2) {
      state.mapPolyline = [{
        points: polylinePoints,
        color: '#FF5722',
        width: 4,
        dottedLine: false,
        arrowLine: true,
        borderColor: '#FFFFFF',
        borderWidth: 2
      }];
    }

    // 计算地图中心点和缩放级别
    calculateMapCenter(polylinePoints);
  }

  // 计算地图中心点和合适的缩放级别
  function calculateMapCenter(points) {
    if (points.length === 0) return;

    if (points.length === 1) {
      // 只有一个点，以该点为中心
      state.mapCenter = points[0];
      state.mapScale = 15;
      return;
    }

    // 计算所有点的边界
    let minLat = points[0].latitude;
    let maxLat = points[0].latitude;
    let minLng = points[0].longitude;
    let maxLng = points[0].longitude;

    points.forEach(point => {
      minLat = Math.min(minLat, point.latitude);
      maxLat = Math.max(maxLat, point.latitude);
      minLng = Math.min(minLng, point.longitude);
      maxLng = Math.max(maxLng, point.longitude);
    });

    // 计算中心点
    state.mapCenter = {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2
    };

    // 计算合适的缩放级别
    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    // 根据距离范围设置缩放级别
    if (maxDiff > 0.1) {
      state.mapScale = 9;  // 远距离
    } else if (maxDiff > 0.05) {
      state.mapScale = 11; // 中距离
    } else if (maxDiff > 0.01) {
      state.mapScale = 13; // 近距离
    } else {
      state.mapScale = 15; // 很近
    }
  }

  // 获取无人机状态对应的样式类
  function getDroneStatusClass() {
    if (!state.droneInfo) return '';
    
    switch (state.droneInfo.status) {
      case 1: // 飞行中
        return 'success';
      case 2: // 返航中
        return 'warning';
      case 5: // 故障
      case 6: // 离线
        return 'danger';
      default:
        return '';
    }
  }

  // 格式化时间
  function formatDateTime(dateTime) {
    if (!dateTime) return '';
    return sheep.$helper.timeFormat(dateTime, 'yyyy-mm-dd hh:MM:ss');
  }

  // 开始无人机信息的实时更新
  function startDroneTracking() {
    if (!state.orderInfo.no) return;

    // 立即获取一次无人机信息
    getDroneInfo(state.orderInfo.no);

    // 每10秒更新一次无人机信息
    droneUpdateTimer = setInterval(() => {
      if (state.orderInfo.status === 20) { // 只在运输中状态更新
        getDroneInfo(state.orderInfo.no);
      } else {
        stopDroneTracking();
      }
    }, 10000);
  }

  // 停止无人机信息更新
  function stopDroneTracking() {
    if (droneUpdateTimer) {
      clearInterval(droneUpdateTimer);
      droneUpdateTimer = null;
    }
  }

  const pickUpVerifyRef = ref();

  async function getOrderDetail(id) {
    // 对详情数据进行适配
    let res;
    if (state.comeinType === 'wechat') {
      // TODO 芋艿：【微信物流】微信场景下
      res = await OrderApi.getOrderDetail(id, {
        merchant_trade_no: state.merchantTradeNo,
      });
    } else {
      res = await OrderApi.getOrderDetail(id);
    }
    if (res.code === 0) {
      state.orderInfo = res.data;
      handleOrderButtons(state.orderInfo);
      // 配送方式：门店自提
      if (res.data.pickUpStoreId) {
        const { data } = await DeliveryApi.getDeliveryPickUpStore(res.data.pickUpStoreId);
        systemStore.value = data || {};
      }
      if (state.orderInfo.deliveryType === 2 && state.orderInfo.payStatus) {
        pickUpVerifyRef.value && pickUpVerifyRef.value.markCode(res.data.pickUpVerifyCode);
      }
      
      // 如果订单状态为运输中(20)，开始无人机跟踪
      if (state.orderInfo.status === 20) {
        startDroneTracking();
      } else {
        stopDroneTracking();
      }
    } else {
      sheep.$router.back();
    }
  }

  onShow(async () => {
    //onShow中获取订单列表,保证跳转后页面为最新状态
    await getOrderDetail(state.orderInfo.id);
  });

  onLoad(async (options) => {
    let id = 0;
    if (options.id) {
      id = options.id;
    }
    // TODO 芋艿：【微信物流】下面两个变量，后续接入
    state.comeinType = options.comein_type;
    if (state.comeinType === 'wechat') {
      state.merchantTradeNo = options.merchant_trade_no;
    }
    state.orderInfo.id = id;
  });

  // 页面隐藏时停止定时器
  onHide(() => {
    stopDroneTracking();
  });

  // 页面卸载时清理定时器
  onUnload(() => {
    stopDroneTracking();
  });
</script>

<style lang="scss" scoped>
  .score-img {
    width: 36rpx;
    height: 36rpx;
    margin: 0 4rpx;
  }

  .apply-btn {
    width: 140rpx;
    height: 50rpx;
    border-radius: 25rpx;
    font-size: 24rpx;
    border: 2rpx solid #dcdcdc;
    line-height: normal;
    margin-left: 16rpx;
  }

  .state-box {
    color: rgba(#fff, 0.9);
    width: 100%;
    background: v-bind(headerBg) no-repeat,
      linear-gradient(90deg, var(--ui-BG-Main), var(--ui-BG-Main-gradient));
    background-size: 750rpx 100%;
    box-sizing: border-box;

    .state-img {
      width: 60rpx;
      height: 60rpx;
      margin-right: 20rpx;
    }
  }

  .order-address-box {
    background-color: #fff;
    border-radius: 10rpx;
    margin: -50rpx 20rpx 16rpx 20rpx;
    padding: 44rpx 34rpx 42rpx 20rpx;
    font-size: 30rpx;
    box-sizing: border-box;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);

    .address-username {
      margin-right: 20rpx;
    }

    .address-detail {
      font-size: 26rpx;
      font-weight: 500;
      color: rgba(153, 153, 153, 1);
      margin-top: 20rpx;
    }
  }

  .drone-tracking-box {
    background-color: #fff;
    border-radius: 10rpx;
    margin: 0 20rpx 20rpx 20rpx;
    padding: 20rpx;
    box-sizing: border-box;

    .tracking-title {
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;

      .title-text {
        font-size: 30rpx;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        margin-right: 10rpx;
      }

      .drone-name {
        font-size: 30rpx;
        font-weight: 500;
        color: var(--ui-BG-Main);
      }
    }

    .map-container {
      width: 100%;
      height: 300rpx;
      border-radius: 8rpx;
      overflow: hidden;
      margin-bottom: 20rpx;

      .delivery-map {
        width: 100%;
        height: 100%;
      }

      .map-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f5f5;

        .placeholder-text {
          font-size: 28rpx;
          color: #999;
        }
      }
    }

    .drone-status {
      .cabinet-info {
        margin-bottom: 20rpx;
        padding-bottom: 20rpx;
        border-bottom: 2rpx solid #f0f0f0;
      }
      
      .status-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10rpx;

        .status-item {
          display: flex;
          align-items: center;

          .status-label {
            font-size: 28rpx;
            color: #999;
            margin-right: 10rpx;
          }

          .status-value {
            font-size: 28rpx;
            color: #333;
            font-family: OPPOSANS;

            &.warning {
              color: #ff9800;
            }
            &.danger {
              color: #f44336;
            }
            &.success {
              color: #4caf50;
            }
            
            &.cabinet-name {
              color: var(--ui-BG-Main);
              font-weight: 500;
            }
          }

          &.full-width {
            flex: 1;
            justify-content: flex-start;
          }
        }
      }
    }
  }

  .detail-goods {
    border-radius: 10rpx;
    margin: 0 20rpx 20rpx 20rpx;

    .order-list {
      margin-bottom: 20rpx;
      background-color: #fff;

      .order-card {
        padding: 20rpx 0;

        .order-sku {
          font-size: 24rpx;

          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          width: 450rpx;
          margin-bottom: 20rpx;

          .order-num {
            margin-right: 10rpx;
          }
        }

        .tag-btn {
          margin-left: 16rpx;
          font-size: 24rpx;
          height: 36rpx;
          color: var(--ui-BG-Main);
          border: 2rpx solid var(--ui-BG-Main);
          border-radius: 14rpx;
          padding: 0 4rpx;
        }
      }
    }
  }

  // 订单信息。
  .notice-box {
    background: #fff;
    border-radius: 10rpx;
    margin: 0 20rpx 20rpx 20rpx;

    .notice-box__head {
      font-size: 30rpx;

      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 80rpx;
      border-bottom: 1rpx solid #dfdfdf;
      padding: 0 25rpx;
    }

    .notice-box__content {
      padding: 20rpx;

      .self-pickup-box {
        width: 100%;

        .self-pickup--img {
          width: 200rpx;
          height: 200rpx;
          margin: 40rpx 0;
        }
      }
    }

    .notice-item,
    .notice-item--center {
      display: flex;
      align-items: center;
      line-height: normal;
      margin-bottom: 24rpx;

      .title {
        font-size: 28rpx;
        color: #999;
      }

      .detail {
        font-size: 28rpx;
        color: #333;
        flex: 1;
      }
    }
  }

  .copy-btn {
    width: 100rpx;
    line-height: 50rpx;
    border-radius: 25rpx;
    padding: 0;
    background: rgba(238, 238, 238, 1);
    font-size: 22rpx;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }

  // 订单价格信息
  .order-price-box {
    background-color: #fff;
    border-radius: 10rpx;
    padding: 20rpx;
    margin: 0 20rpx 20rpx 20rpx;

    .notice-item {
      line-height: 70rpx;

      .title {
        font-size: 28rpx;
        color: #999;
      }

      .detail {
        font-size: 28rpx;
        color: #333;
        font-family: OPPOSANS;
      }
    }

    .all-rpice-item {
      justify-content: flex-end;
      align-items: center;

      .title {
        font-size: 26rpx;
        font-weight: 500;
        color: #333333;
        line-height: normal;
      }

      .all-price {
        font-size: 26rpx;
        font-family: OPPOSANS;
        line-height: normal;
        color: $red;
      }
    }
  }

  // 底部
  .footer-box {
    height: 100rpx;
    width: 100%;
    box-sizing: border-box;
    border-radius: 10rpx;
    padding-right: 20rpx;

    .cancel-btn {
      width: 160rpx;
      height: 60rpx;
      background: #eeeeee;
      border-radius: 30rpx;
      margin-right: 20rpx;
      font-size: 26rpx;
      font-weight: 400;
      color: #333333;
    }

    .pay-btn {
      width: 160rpx;
      height: 60rpx;
      font-size: 26rpx;
      border-radius: 30rpx;
      font-weight: 500;
      color: #fff;
    }
  }
</style>
