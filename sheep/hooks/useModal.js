import $store from '@/sheep/store';
import $helper from '@/sheep/helper';
import dayjs from 'dayjs';
import { ref } from 'vue';
import test from '@/sheep/helper/test.js';
import AuthUtil from '@/sheep/api/member/auth';

// 打开授权弹框
export function showAuthModal(type = 'accountLogin') {
  const modal = $store('modal');
  // #ifdef H5
  closeAuthModal();
  setTimeout(() => {
    modal.$patch((state) => {
      state.auth = type;
    });
  }, 200);
  // #endif

  // #ifndef H5
  modal.$patch((state) => {
    state.auth = type;
  });
  // #endif
}

// 关闭授权弹框
export function closeAuthModal() {
  $store('modal').$patch((state) => {
    state.auth = '';
  });
}

// 打开分享弹框
export function showShareModal() {
  $store('modal').$patch((state) => {
    state.share = true;
  });
}

// 关闭分享弹框
export function closeShareModal() {
  $store('modal').$patch((state) => {
    state.share = false;
  });
}

// 打开快捷菜单
export function showMenuTools() {
  $store('modal').$patch((state) => {
    state.menu = true;
  });
}

// 关闭快捷菜单
export function closeMenuTools() {
  $store('modal').$patch((state) => {
    state.menu = false;
  });
}

// 记录广告弹框历史
export function saveAdvHistory(adv) {
  const modal = $store('modal');

  modal.$patch((state) => {
    if (!state.advHistory.includes(adv.imgUrl)) {
      state.advHistory.push(adv.imgUrl);
    }
  });
}
