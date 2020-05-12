// index/game.js
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from './store'
import { createScopedThreejs } from 'threejs-miniprogram'

const  gameModel = require('./gameModel')

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
        .in(this)
        .select('.canvas1')
        .node()
        .exec((res) => {
          const canvas = res[0].node
          const THREE = createScopedThreejs(canvas)
          gameModel.renderModel(canvas, THREE)
        })
    },

    onTouchStartCallback: function(event) {
      console.log('onTouchStart.')
      gameModel.onTouchStart(event)
    },

    onTouchMoveCallback: function(event) {
      gameModel.onTouchMove(event)
    },
  }
})
