import request from '@/sheep/request';

const DroneApi = {
  // 获取最近的无人机柜列表
  getNearestCabinetList: (params) => {
    return request({
      url: '/drone/cabinet/nearest',
      method: 'GET',
      params,
    });
  },
  
  // 根据订单号查询无人机信息
  getDroneByOrder: (orderNo) => {
    return request({
      url: 'app/drone/get-by-order',
      method: 'GET',
      params: {
        orderNo,
      },
      custom: {
        showLoading: false,
        showError: false,
      },
    });
  },


};

export default DroneApi; 