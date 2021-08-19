<template>
  <div class="test-container">
    {{ testData }}
    <span class="small">baka</span>
    <img src="//xxx.com/111.png" alt="静态图片地址">
    <img :src="src" alt="动态图片地址">
    <div>当前时间：{{Date.now()}}</div>
    <div>{{ Math.random() > maxSize ? '大于' : '小于' }}限制</div>
    <div>{{ showSize() }}</div>

    <div class="pic-list">
      <!--循环展示图片-->
      <img :src="item.remark" :alt="item.alt" v-for="item in items">
    </div>

    <div v-if="Math.random() > 0.5">
      有时候显示这个dom
    </div>
    <div v-else-if="Math.random() > 0.9">
      其他时候显示这个dom
    </div>
    <div v-else>
      极小概率显示这个dom
    </div>

    <div @click="count ++">
      点击增加：{{ count }}
    </div>

    <div @click="add">
      点击增加：{{ count2 }}
    </div>

  </div>
</template>

<script>
export default {
  name: "test",
  data() {
    return {
      testData: '这是一个测试数据',
      src: 'http://xxx.com/123.jpg',
      maxSize: 0.5,
      count: 0,
      count2: 0,
      items: [
        {
          remark: '//xxx.com/001.jpg',
          alt: '这是第1张图片'
        },
        {
          remark: '//xxx.com/002.jpg',
          alt: '这是第2张图片'
        },
        {
          remark: '//xxx.com/003.jpg',
          alt: '这是第3张图片'
        },
      ]
    }
  },
  beforeCreate() {
    // 挂载页面前加载
  },
  created() {
    // 挂载页面后候加载
    this.init()
  },
  beforeMount() {
    // 渲染页面前加载
  },
  mounted() {
    // 渲染页面后加载
  },
  beforeUpdate() {
    // 更新页面前加载
  },
  updated() {
    // 更新页面后加载
  },
  beforeDestroy() {
    // 卸载页面前加载
  },
  destroyed() {
    // 卸载页面后加载
  },
  methods: {
    // 所有自定义函数
    init() {
      setTimeout(() => {
        this.testData = '时空baka'
        this.src = '//xxx.com/555.png'
      }, 5000)
    },
    showSize() {
      return Math.random()
    },
    add() {
      this.count2 ++
    }
  }
}
</script>

<style scoped>

</style>
