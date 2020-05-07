import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from './store'

Page({
  data: {
    result: ""
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['state'],
      actions: ['nextState'],
    })
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings()
  }
})
