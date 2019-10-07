# 富文本

## 1、安装

```shell
npm i vue-ueditor-wrap
or
yarn add vue-ueditor-wrap
```

## 2、下载文件(https://github.com/wangyuzZZ/ueditor)

>下载好的文件放在static目录下 vue3.x 可放在public目录下

## 3、引入

```javascript
import VueUeditorWrap from 'vue-ueditor-wrap'

/**
*注册组件
*/
components:{
    VueUeditorWrap
}
```

## 4、使用

```javascript
//实例
<template>
  <div class="page admin">
    <vue-ueditor-wrap
      v-model="msg"
      :config="myConfig"
      :accept="'image/*'"
      list-type="picture-card"
      class="ueditor"
    ></vue-ueditor-wrap>
  </div>
</template>
<script>
import VueUeditorWrap from "vue-ueditor-wrap"; // ES6 Module
export default {
  name: "Admin",
  data() {
    return {
      myConfig: {
        //文件目录
        UEDITOR_HOME_URL: "/static/utf8-php/",
        //后台给的网络配置地址
        serverUrl: "http://hwbport.hjbloc.com/php/controller.php",
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 600,
        // 初始容器宽度
        initialFrameWidth: "100%"
      },
        //双向绑定
      msg: ""
    };
  },
  methods: {
  },
  components: {
    VueUeditorWrap
  }
};
</script>
<style lang="less">
.admin {
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0 0 5px rgb(179, 192, 209);
  background: rgba(240, 240, 240, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  .ueditor{
    margin: 10px 0;
  }
}
</style>
```

>更多配置请参考http://fex.baidu.com/ueditor/