<template>
  <div>
    <!-- tabs -->
    <div v-if="tabs.length" class="tabs-box" ref="tabs-box">
      <div class="tabs" ref="tabs" >
        <div
          class="tab"
          :class="{active: activeIdx === idx}"
          v-for="(item, idx) in tabList"
          :key="idx"
          @click="setActive(idx)">
          {{ item.name }}
        </div>
      </div>
    </div>

    <!-- wrapper -->
    <div class="content-wrapper" :style="{height: contentHeight + 'px'}" ref="content-wrapper">
      <slot></slot>
      <infinite-loading :identifier="resetStateId" @infinite="infiniteHandler" spinner="spiral">
        <div style="padding-top: 10px;" slot="spinner"><i class="loading-spiral" spinner="spiral"></i>数据加载中...</div>
        <div class="empty" style="padding-top: 60px;" slot="error">
          {{ errorMsg }}<br>
        </div>
        <div class="empty" slot="no-results">没有更多数据~</div>
        <div class="empty" slot="no-more">没有更多数据~</div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
export default {
  name: 'vue-slide-tabs',
  components: {
    InfiniteLoading
  },
  props: {
    tabs: {
      type: Array,
      default: []
    },
    tabCurIdx: {
      type: Number,
      default: 0
    },
    contentHeight: {
      type: Number,
      default: window.innerHeight - 36
    }
  },
  data () {
    return {
      activeIdx: 0,
      tabList: [],
      errorMsg: '数据加载失败！',
      resetStateId: +new Date()
    }
  },
  created () {
    if (this.tabs.length) {
      this.tabs.forEach(name => {
        let item = {}
        item.name = name
        item.page = 0
        item.scrollTop = 0
        item.list = []
        this.tabList.push(item)
      })
    } else {
      this.tabList.push({
        page: 0,
        scrollTop: 0,
        list: []
      })
    }
    this.activeIdx = this.tabCurIdx
  },
  watch: {
    tabCurIdx (val) {
      this.activeIdx = val
    },
    activeIdx (val, oldVal) {
      let scrollTop = this.$refs['content-wrapper'].scrollTop
      this.tabList[oldVal].scrollTop = scrollTop

      localStorage.setItem('curTopic', val)
      this.activeIdx = val
      // 重置加载状态
      this.resetStateId = +new Date()
      this.$nextTick(() => {
        this.$refs['content-wrapper'].scrollTop = this.tabList[val].scrollTop
      })
      // 重置tabs的位置
      let $tabBox = this.$refs['tabs-box']
      let rectBox = $tabBox.getBoundingClientRect()
      let rectActive = document.querySelectorAll('.tab')[this.activeIdx].getBoundingClientRect()

      let centerX = rectBox.width / 2 + rectBox.x
      let dis = rectActive.x + rectActive.width / 2 - centerX
      this.animateScroll(dis, $tabBox)
    }
  },
  methods: {
    infiniteHandler ($state) {
      if (!this.loadedUtiled) {
        let loadedCallback = $state.loaded
        let completeCallback = $state.complete
        $state.loaded = (list) => {
          let tabObj = this.tabList[this.activeIdx]
          tabObj.page += 1
          tabObj.list = tabObj.list.concat(list || [])
          loadedCallback()
        }
        $state.complete = (list) => {
          let tabObj = this.tabList[this.activeIdx]
          tabObj.page += 1
          tabObj.list = tabObj.list.concat(list || [])
          completeCallback()
        }
        this.loadedUtiled = true
      }

      let tabObj = this.tabList[this.activeIdx]

      this.$emit('loadData', {
        page: tabObj.page,
        activeIdx: this.activeIdx,
        tabName: tabObj.name,
        list: tabObj.list || [],
        $state: $state
      })
    },
    animateScroll (dis, $tabBox) {
      if (Math.abs(dis) > 5) {
        if (dis > 0) {
          dis -= 5
          $tabBox.scrollLeft = $tabBox.scrollLeft + 5
        } else {
          dis += 5
          $tabBox.scrollLeft = $tabBox.scrollLeft - 5
        }
        setTimeout(() => {
          this.animateScroll(dis, $tabBox)
        }, 0)
      } else if (Math.abs(dis) > 0) {
        $tabBox.scrollLeft = dis + $tabBox.scrollLeft
      }
    },
    setActive (idx) {
      this.activeIdx = idx
      this.$emit('tabClick', this.tabList[this.activeIdx])
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tabs-box {
  width: 100%;
  padding-bottom: 2px;
  overflow-x: auto;
  overflow-y: hidden;
}
.tabs {
  background: #fff;
  display: flex;
  min-width: 500px;
  box-shadow: 0 0px 2px rgba(0,0,0,.1);
}
.tabs .tab {
  padding: 8px 10px;
  flex-shrink: 0;
  flex-grow: 1;
  font-size: 14px;
}
.tab.active {
  border-bottom: 1px solid #658dd6;
  color: #658dd6;
}
.empty {
  padding-top: 20px;
  font-size: 14px;
  line-height: 1.5;
}
.content-wrapper {
  height: 400px;
  overflow-y: auto;
}
</style>
