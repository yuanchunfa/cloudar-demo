// index/cloudar.js
import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from './store'

const cloudar = requirePlugin("cloudar");

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

  ready: function() { this.start(); },

  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    result: ""
  },

  /**
   * Component methods
   */
  methods: {
    onLoad: function (options) {
      this.start();
    },
  
    async start() {
      console.log('start cloudar.');
      
      const { identifier, metadata } = await cloudar.startCloudar();
      const { data: { projectId, sceneId } } = JSON.parse(metadata);
  
      const result = JSON.stringify({
        collectionId: projectId,
        identifier,
        sceneId,
      }, null, "\t");
      this.setData({ result });
    },
  
    stop() {
      console.log('stop cloudar.');
      cloudar.stopCloudar();
      this.resetState();
    },
  
    error(e) {
      if (e && e.detail && e.detail.detail && e.detail.detail.errMsg) {
        if (e.detail.detail.errMsg.includes("auth")) {
          const page = this;
          wx.showModal({
            title: "提示",
            content: "请给予“摄像头”权限",
            success() {
              wx.openSetting({
                success({ authSetting: { "scope.camera": isGrantedCamera } }) {
                  if (isGrantedCamera) {
                    wx.redirectTo({ url: '/' + page.__route__ });
                  } else {
                    wx.showToast({ title: "获取“摄像头”权限失败！", icon: "none" });
                  }
                }
              });
            }
          });
        }
      }
    }
  }
})
