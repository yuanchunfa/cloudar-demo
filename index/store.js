import { configure, observable, action } from 'mobx-miniprogram'

// 不允许在动作外部修改状态
configure({ enforceActions: 'observed' });

export const store = observable({
  // 数据字段
  state: 0,

  // actions
  resetState: action(function () {
    console.log('reset state.');
    this.state = 0;
  }),

  nextState: action(function () {
    console.log('next state.');
    this.state++;
  })
})