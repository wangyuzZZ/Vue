<template>
  <div class="page serach">
    这是搜索页
    <el-button type="primary">主要按钮</el-button>
    <el-button type="text">文字按钮</el-button>
  </div>
</template>
<script>
export default {
  name: "Serach",
  data() {
    return {};
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    /**
     * 测试vuex
     */
    console.log("修改前：" + this.$store.state.name);
    this.$store.commit("changeName", "猴子");
    console.log("修改后：" + this.$store.state.name);
    this.$store.dispatch("actionsChange", "123");
    console.log("修改后：" + this.$store.state.name);
  }
};
</script>
<style lang="less">
</style>