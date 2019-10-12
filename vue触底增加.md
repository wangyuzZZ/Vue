# 触底增加

## 1、浏览器窗口滚动条触底增加

```javascript
mounted(){
    window.addEventListener('scroll',this.handleScroll,true);
},
methods: {
    handleScroll(e){
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = e.target.documentElement.scrollTop;
      //变量windowHeight是可视区的高度
      var windowHeight = e.target.documentElement.clientHeight;
      //变量scrollHeight是滚动条的总高度
      var scrollHeight = e.target.documentElement.scrollHeight;
        //滚动条到底部的条件
        if(scrollTop+windowHeight==scrollHeight){
            //写后台加载数据的函数
         	console.log("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
            alert("距顶部"+scrollTop+"可视区高度"+windowHeight+"滚动条总高度"+scrollHeight);
        }
    }
}
```

## 2、自定义容器滚动条触底增加

```javascript
//实例
<div class="page news" ref="Box" @scroll="orderScroll($event)">
   //、、、
</div>

//js部分
orderScroll(e) {
      //变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = e.target.scrollTop;
      //变量自定义容器是可视区的高度
      var windowHeight = this.$refs.Box.clientHeight;
      //变量scrollHeight是滚动条的总高度
      var scrollHeight = this.$refs.Box.scrollHeight;
      //滚动条到底部的条件
      if (scrollTop + windowHeight == scrollHeight) {
        //函数、、、
      }
    }
```

