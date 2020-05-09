// index/game.js
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from './store'
import { createScopedThreejs } from 'threejs-miniprogram'

const { renderModel } = require('./gameModel')

Component({
  options: {
    styleIsolation: 'shared'
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: {
      state: 'state'
    },
    actions: {
      nextState: 'nextState',
      resetState: 'resetState'
    },
  },

  ready: function() { 
    setTimeout(() => this.initGame(), 1000); 
    //this.initGame();
  },

  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    initGame: function () {
      wx.createSelectorQuery()
        .select('#webgl')
        .node()
        .exec((res) => {
          const canvas = res[0].node
          const THREE = createScopedThreejs(canvas)
          renderModel(canvas, THREE)
        })
    },
  }
})
