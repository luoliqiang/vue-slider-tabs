# vue-slider-tabs

## Intro
<div>a loading data tabs plugin for Vue.js, to help you to use tabs to load data and infinite scroll.
it can cache the tab data and remember the scroll height so that you can avoid repeatedly load your data.</div>
![GitHub](demo.png)
## Features
* mobile friendly
* each tab infinite scroll supported
* tab data cached

## Usage & Guide
install
```js
npm install vue-slider-tabs
```
import with npm or window
```js
import swipperTabs from './swipperTabs.vue'
<scirpt src="dist/vue-slider-tabs.js"></script>
```
usage
```js
<swipper-tabs
  :tabs="tabs"
  :tabCurIdx="tabCurIdx"
  @tabClick="tabClickHandler"
  @loadData="loadDataHandler">
  <!-- slot for tab content -->
    <ul>
      <li v-for="item in list"></li>
    </ul>
  </div>
</swipper-tabs>
```
params
* `tabs` - [Array tab names. eg: ['all', 'girl', 'food'], empty Array can hide the tabs, suitable for the no tabs just infinite loading data.
* `tabCurIdx` - [Number] init active tab index.
* `tabClick` - [Function(`cachelist`)] tab click handler, cachelist params is the click tab cache page data list
* `loadData` - [Function(`page, activeIdx, tabName, list, $state`)] tab data load hook handler; swipperTabs inner use “vue-infinite-loading” to infinite load data , whenerver need to loading data it will trigger loadData callback to emit to swipperTabs,so you need to handle your own http request in the loadData Function.

`$state:` whenerver you loaded your data, you need to use the $state params to stop the inifinite loading status and pass on the loaded datas to the $state callback to cache the list.
 `$state.loaded(data)`: to stop the current page load, 
 `$state.complete(data)`: means you load all the pages data,
 `$state.error()`: when error happend during the load,for more useage please consult the [vue-infinite-loading](https://github.com/PeachScript/vue-infinite-loading) github.

```js
loadData (loadParams) {
  this.$http.get(url)
    .then(list) {
      if (list && list.length) {
        // render your list
        this.list = this.list.concat(list)
        // change the loading status, data as params to add as the cache list
        loadParams.$state.loaded(list)
      } else { // all data loaded
        loadParams.$state.complete(list)
      }
    }
    .catch(err) {
      loadParams.$state.error()
    }
}
``` 
## Author
luoliqiang
