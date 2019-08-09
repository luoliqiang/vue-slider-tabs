import sliderTabs from './src/sliderTabs.vue'

Object.defineProperty(sliderTabs, 'install', {
  configurable: false,
  enumerable: false,
  value (Vue) {
    Vue.component('slide-tabs', sliderTabs)
  }
})

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component('slide-tabs', sliderTabs)
}

export default sliderTabs
