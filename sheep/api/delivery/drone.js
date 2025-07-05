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
};

export default DroneApi; 