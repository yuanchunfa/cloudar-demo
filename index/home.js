// index/home.js
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from './store'

Component({
  options: {
    styleIsolation: 'shared'
  },
  behaviors: [storeBindingsBehavior],
  data: {
    someData: '...'
  },
  storeBindings: {
    store,
    fields: {
      state: 'state'
    },
    actions: {
      startAR: 'nextState'
    },
  }
})
