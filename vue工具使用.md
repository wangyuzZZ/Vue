# Less

## 1.安装

```shell
yarn add -s less less-loader
or
npm install less less-loader --save
```

##  2.使用

```javascript
//(修改webpack.base.conf.js文件，配置loader加载依赖，让其支持外部的less,在原来的代码上添加如下代码
<template>
    <div class="pages home">
        这是首页
    </div>
</template>
<script>
export default {
    name:"Home",
    data() {
        return {
            
        }
    },
}
</script>
<style lang="less" scoped>
    
</style>
```

## 3.全局使用(创建单个less文件)

### 1.安装

```shell
npm install style-resources-loader -D
or
yarn add style-resources-loader -D
```

### 2.修改配置

![image-20200403114458980](C:\Users\WangKong\AppData\Roaming\Typora\typora-user-images\image-20200403114458980.png)

```javascript
//在build 的utils.js中generateLoaders方法中加上一下代码：
if(loader == 'less'){
      loaders.push({
        loader: 'style-resources-loader',
        options:{
          patterns:path.resolve(__dirname,'../src/assets/normalized.less')
        }
      })
    }
```

>记得更改patterns路径
>
>然后在app.vue 引用 normalized.less 就可以全局使用了

# axios

## 安装

```shell
yarn add -s axios
or
npm i -S axios
```

## 引入

```javascript
//在main.js中
//导入axios
import Axios from 'axios'
//挂载到vue
Vue.prototype.$axios = Axios
```

>提示：
>
>-> 可以在plugins中全局引入 axios。
>
>-> axios 请求需挂载在 **create** 生命周期钩子上。

##  示例

### 1.GET

```javascript
this.$axios.get('url', {
  params: {
      // get 参数可放置于此字段中，key-value对形式设置
      // 一般建议这么做，便于控制
      //例
      name:'wy'
      
  }
}).then(res => {
    //请求成功返回的值
  	console.log(res)
})
.catch(error => {
    //请求失败返回的值
 	 console.log(error);
})
```

### 2.post

```javascript
this.$axios.post('url', $Qs.stringify({
    // post 参数直接在第2个参数中以key-value对形式设置
    //例
    name:'admin',
    password:'123'
}))
.then(res => {
    //请求成功返回的值
  	console.log(res)
})
.catch(error => {
    //请求失败返回的值
  console.log(error);
})
```

>注意：
>
>form-data：?name=LiHongyao&age=25
>
>x-www-form-urlencode：{name=LiHongyao, age=25}
>
>axios 接受的 **post** 请求参数格式是 form-data 格式，
>
>如何将 x-www-form-urlencode 转换为 form-data 格式呢？操作如下：
>
>stips1 -> 首先你需要引入 **qs** 库，qs库无需安装，直接引入即可：
>
>可以全局引用
>
>```javascript
>//mian.js中
>import Qs from 'qs'
>//挂载
>Vue.prototype.$Qs = Qs
>```

## 全局配置

```javascript
//在main.js中
Axios.defaults.baseURL = 'localhost://8081';

//例
this.$Axios.get('localhost://8081/goods',{
    ...
})
//可替换为
this.$Axios.get('/goods',{
    ...
})    
```

全局配置的好处在于在请求当前域名下的资源时，我们无需在加域名，只需要写资源相对路径即可。

## 拦截器

在请求或响应被then或catch 处理前拦截它们

```javascript
//在main.js中
// 添加请求拦截器
Axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  console.log( config)
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
Axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  console.log(response)
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
```

>为什么需要拦截器呢？拦截器可以做什么事情？
>
>我们可以通过拦截器判断参数是否合理？请求有没有问题？请求的数据是否有问题？
>
>比如，我们之前对数据进行请求时，需要对请求参数做转换，我们可以把转换的逻辑扔在拦截器中进行处理，如下所示：
>
>```javascript
>import Qs from 'qs';
>Axios.interceptors.request.use(function (config) {
>  if(config.method == 'post') {
>    config.data = Qs.stringify(config.data);
>  }
>  return config;
>}, function (error) {
>  return Promise.reject(error);
>});
>```

## 解决跨域

1.修改./config.index.js文件：

```javascript
proxyTable: {
  '/api': {
    target: 'http://api.douban.com/v2',
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  }
}
```

2.在main.js文件中添加host

```javascript
Vue.prototype.HOST = '/api'
```

3.请求数据

```javascript
let url = this.HOST + '/movie/top250';
this.$axios.get(url, {
  params: {
    count: 10,
    start: 0
  }
})
.then(res => {
  console.log(res);
}).catch(error => {
  console.log(error);
})

//后台跨越处理只需要设置 res.setHeader("Access-Control-Allow-Origin", "*");
```

> 注意：此种跨域解决方案，只适用于测试阶段，打包的时候，不具备服务器，就不能跨域了，交给后端处理。产品上线之后，就不存在跨域问题啦

> 提示：一旦修改了配置文件，需重新执行‘npm run dev’，否则配置不生效。

# Vuex

参考：

- https://vuex.vuejs.org/zh/

## 概述

Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化（这句话简单理解就是组件数据共享）。Vuex 也集成到 Vue 的官方调试工具 [devtools extension](https://github.com/vuejs/vue-devtools)，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

### 1、什么情况下使用vuex

虽然 Vuex 可以帮助我们管理共享状态，但也附带了更多的概念和框架。这需要对短期和长期效益进行权衡。

如果您不打算开发大型单页应用，使用 Vuex 可能是繁琐冗余的。确实是如此——如果您的应用够简单，您最好不要使用 Vuex。一个简单的 [global event bus](https://cn.vuejs.org/v2/guide/components.html#%E9%9D%9E%E7%88%B6%E5%AD%90%E7%BB%84%E4%BB%B6%E9%80%9A%E4%BF%A1) 就足够您所需了。但是，如果您需要构建一个中大型单页应用，您很可能会考虑如何更好地在组件外部管理状态，Vuex 将会成为自然而然的选择。引用 Redux 的作者 Dan Abramov 的话说就是：

> Flux 架构就像眼镜：您自会知道什么时候需要它。

### 2、vuex 状态管理

View -> （Dispatch）Action -> （Commit）Mutations -> （Mutate）state -> View

注意：Action 不是必需品，如果有异步操做才可能用到Action，否则可以不使用。

### 安装/引用

```shell
npm i -S vuex
or
yarn add -s vuex
```

在一个模块化的打包系统中，您必须显式地通过 `Vue.use()` 来安装 Vuex：

-> ./src/store/index.js

```js
import Vue  from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

## 开始

每一个 Vuex 应用的核心就是 store（仓库）。“store”基本上就是一个容器，它包含着你的应用中大部分的**状态 (state)**。Vuex 和单纯的全局对象有以下两点不同：

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地**提交 (commit) mutation**。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

[安装](https://vuex.vuejs.org/zh/installation.html) Vuex 之后，让我们来创建一个 store。

-> ./src/store/index.js

```js
export default new Vuex.Store({
  state: {
      
  },
  mutations: {
      
  }
  ...
});
```

> 注意：一定要在将store注入到vue实例中，如下所示：
>
> ```js
> import store from './Store'
> new Vue({
> el: '#app',
> store,
> components: { App },
> template: '<App/>'
> })
> ```

现在，你已经创建好一个 store 仓库。关于store 仓库的一些配置，请参考核心概念。

## 核心概念

### 1、State *

Vuex 使用**单一状态树**，用一个对象就包含了全部的应用层级状态。至此它便作为一个“唯一数据源 ([SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth))”而存在。这也意味着，每个应用将仅仅包含一个 store 实例。单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。

我们定义一个状态属性，如下所示：

```js
new Vuex.Store({
  state: {
    count: 0
  }
});
```

这样，我们就可以在任意组件中获取到该状态值啦，获取方式如下：

```js
this.$store.state.count
```

### \> mapState

当一个组件需要获取多个状态时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 `mapState` 辅助函数帮助我们生成计算属性，让你少按几次键：

```js
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        msg: "Hello, VueX",
        username: "admin",
        num: 10
    },
    mutations: {

    }
});
```



```js
import { mapState } from 'vuex'

export default {
    name: "Home",
    data() {
        return {
            m: 5
        }
    },
    computed: mapState({
        // 写法1：箭头函数可使代码更简练
        msg:state => state.msg,
        // 写法2：传字符串参数 'username' 等同于 `state => state.username`
        username: "username",
        // 写法3：为了能够使用 `this` 获取局部状态，必须使用常规函数
        sum(state) {
            return state.num + this.m;
        }
    })
}
```

当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 `mapState` 传一个字符串数组。

```js
computed: mapState([
    "msg", 
    "num", 
    "username"
])
```

### \> 对象展开运算符

`mapState` 函数返回的是一个对象。我们如何将它与局部计算属性混合使用呢？通常，我们需要使用一个工具函数将多个对象合并为一个，以使我们可以将最终对象传给 `computed` 属性。但是自从有了[对象展开运算符](https://github.com/sebmarkbage/ecmascript-rest-spread)（现处于 ECMAScript 提案 stage-4 阶段），我们可以极大地简化写法：

```js
computed: {
    sum() {
        return this.num + this.m;
    },
    ...mapState([
        "msg", 
        "num", 
        "username"
    ])
}
```

### 2、Mutation *

更改 Vuex 的 store 中的状态的**唯一方法**是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 **事件类型 (type)** 和 一个 **回调函数 (handler)**。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      // 变更状态
      state.count++;
    }
  }
});
```

你不能直接调用一个 mutation handler。这个选项更像是事件注册：“当触发一个类型为 `increment` 的 mutation 时，调用此函数”。要唤醒一个 mutation handler，你需要以相应的 type 调用 **store.commit** 方法：

```js
this.$store.commit('increment');
```

### > 提交载荷

你可以向 `store.commit` 传入额外的参数，即 mutation 的 **载荷（payload）**：

```js
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}
```

```js
this.$store.commit('increment', 10);
```

在大多数情况下，载荷应该是一个对象，这样可以包含多个字段并且记录的 mutation 会更易读：

```js
// ...
mutations: {
  increment(state, payload) {
    state.count += payload.number;
  }
}
```

```js
this.$store.commit('increment', {
    number: 10
});
```

### > 对象提交

提交 mutation 的另一种方式是直接使用包含 `type` 属性的对象：

```js
this.$store.commit({
    type: 'increment',
    number: 10
});
```

当使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数，因此 handler 保持不变：

```js
mutations: {
  increment (state, payload) {
    state.count += payload.number
  }
}
```

### > 响应规则

既然 Vuex 的 store 中的状态是响应式的，那么当我们变更状态时，监视状态的 Vue 组件也会自动更新。这也意味着 Vuex 中的 mutation 也需要与使用 Vue 一样遵守一些注意事项：

1. 最好提前在你的 store 中初始化好所有所需属性。

2. 当需要在对象上添加新属性时，你应该

   - 使用 *Vue.set(obj, 'newProp', 123)* , 或者

   - 以新对象替换老对象。例如，利用 stage-3 的[对象展开运算符](https://github.com/sebmarkbage/ecmascript-rest-spread)我们可以这样写：

     ```js
     state.obj = { ...state.obj, newProp: 123 }
     ```

### \> 使用常量

使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：

```js
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```

```js
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

用不用常量取决于你——在需要多人协作的大型项目中，这会很有帮助。但如果你不喜欢，你完全可以不这样做。

### \> mapMutations

你可以在组件中使用 `this.$store.commit('xxx')` 提交 mutation，或者使用 `mapMutations` 辅助函数将组件中的 methods 映射为 `store.commit` 调用（需要在根节点注入 `store`）。

```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', 
      // 将 `this.increment()` 映射为 `this.$store.commit('increment')`

      // `mapMutations` 也支持载荷：
      'incrementBy'
      // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' 
      // 将 `this.add()` 映射为 `this.$store.commit('increment')`
    })
  }
}
```

## 3、Action *

Action 类似于 Mutation，不同在于：

- Action 提交的是 mutation，而不是直接变更状态。
- Action 可以包含任意异步操作。

让我们来注册一个简单的 action：

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  actions: {
    // context: 承上启下/上下文
    increment(context) {
      context.commit('increment');
    }
  }
});
```

实践中，我们会经常用到 ES2015 的 [参数解构](https://github.com/lukehoban/es6features#destructuring) 来简化代码（特别是我们需要调用 `commit` 很多次的时候）

```js
actions: {
  increment ({ commit }) {
    commit('increment')
  }
}
```

分发Action

```js
this.$store.dispatch('increment');
```

Actions 支持同样的载荷方式和对象方式进行分发：

```js
// 以载荷形式分发
store.dispatch('incrementAsync', {
  amount: 10
})

// 以对象形式分发
store.dispatch({
  type: 'incrementAsync',
  amount: 10
})
```

### \> mapActions

你在组件中使用 `this.$store.dispatch('xxx')` 分发 action，或者使用 `mapActions`辅助函数将组件的 methods 映射为 `store.dispatch` 调用（需要先在根节点注入 `store`）：

```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    ...mapActions([
      'increment', 
      // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

      // `mapActions` 也支持载荷：
      'incrementBy' 
      // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment'
      // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```

## 4、Getter

有时候我们需要从 store 中的 state 中派生出一些状态

```js
getters: {
  birth(state) {
    let idCard = state.idCard;
    let year   = idCard.slice(6, 10);
    let month  = idCard.slice(10, 12);
    let day    = idCard.slice(12, 14);
    return `${year}-${month}-${day}`
  }
}
```

读取：

```js
this.$store.getters.birth
```

## Module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。

为了解决以上问题，Vuex 允许我们将 store 分割成**模块（module）**。每个模块拥有自己的 state、mutation、action、getter。

参考：<https://vuex.vuejs.org/zh/guide/modules.html>



## 总结

1. vuex 使用流程

```js
1. 安装
2. 引入
3. 创建
4. 配置
- state  状态属性
- mutaions 修改状态
- actions(可选) 提交修改(异步)
5. 访问状态：this.$store.state.属性名
6. 提交mutaions：this.$store.commit("", params.)
7. 提交actions：this.$store.dispatch("", params.)

## 简化操作
1. 
mapState: computed> ...mapState(["state_name"...])
this.state_name === this.$store.state.state_name

2. 
mapMutaions: methods> ...mapMutations(["mutaion_name"...])
this.mutaion_name() === this.$store.commit("mutaion_name");

3. 
mapActions: methods> ...mapActions(["action_name"...])
this.action_name() === this.$store.dispatch("action_name")
```

