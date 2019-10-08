# 监听函数 & 计算函数

官方(https://cn.vuejs.org/v2/guide/computed.html)

## 1、watch

```JavaScript
//实例
//监听普通变量
data(){
    return{
        num:1,
        obj:{
            num:1
        }
    }
},
watch:{
    num(newval,oldval){
        console.log('新' + newval,'旧' + oldval)
    }
}
//监听对象(借助computed)
computed: {
    newObj: function () {
      return this.obj.num
    }
  }
watch:{
    newObj:{
      //handler方法和immediate属性上面的例子是值变化时候，watch才执行，我们想让值最初时候watch就执行就用到了handler和immediate属性
      handler(val, oldVal){
         console.log(oldVal);
      },
      //deep属性（深度监听，常用语对象下面属性的改变）
      deep:true
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true
    }
}
```

```javascript
//这样的方法对性能影响很大，修改obj里面任何一个属性都会触发这个监听器里的 handler。我们可以做如下处理：
newObj:{
      handler(val, oldVal){
         console.log(oldVal);
      },
      //deep:true
      immediate: true
    }
```

## 2、computed

```javascript
//实例
<div id="app">
    <p>{{fullName}}</p>
</div>
data: {
    firstName: 'Xiao',
        lastName: 'Ming'
},
computed: {
    fullName: function () {
        return this.firstName + ' ' + this.lastName
    }
}
```

>Vue中我们不需要在template里面直接计算`{{this.firstName + ' ' + this.lastName}}`，因为在模版中放入太多声明式的逻辑会让模板本身过重，尤其当在页面中使用大量复杂的逻辑表达式处理数据时，会对页面的可维护性造成很大的影响，而`computed`的设计初衷也正是用于解决此类问题。

在分析`computed`源码之前我们先得对Vue的响应式系统有一个基本的了解，Vue称其为非侵入性的响应式系统，数据模型仅仅是普通的JavaScript对象，而当你修改它们时，视图便会进行自动更新。

![clipboard.png](https://segmentfault.com/img/bVbgp96?w=610&h=392)

> 当你把一个普通的 JavaScript 对象传给 Vue 实例的 `data` 选项时，Vue 将遍历此对象所有的属性，并使用 `Object.defineProperty` 把这些属性全部转为 `getter/setter`，这些 `getter/setter` 对用户来说是不可见的，但是在内部它们让 Vue 追踪依赖，在属性被访问和修改时通知变化，每个组件实例都有相应的 `watcher` 实例对象，它会在组件渲染的过程中把属性记录为依赖，之后当依赖项的 `setter` 被调用时，会通知 `watcher` 重新计算，从而致使它关联的组件得以更新。

Vue响应系统，其核心有三点：`observe`、`watcher`、`dep`：

1. `observe`:遍历`data`中的属性，使用 [Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 的`get/set`方法对其进行数据劫持
2. `dep`：每个属性拥有自己的消息订阅器`dep`，用于存放所有订阅了该属性的观察者对象
3. `watcher`：观察者（对象），通过`dep`实现对响应属性的监听，监听到结果后，主动触发自己的回调进行响应

对响应式系统有一个初步了解后，我们再来分析计算属性。
首先我们找到计算属性的初始化是在`src/core/instance/state.js`文件中的`initState`函数中完成的

```javascript
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  // computed初始化
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```

调用了`initComputed`函数（其前后也分别初始化了`initData`和`initWatch`）并传入两个参数`vm`实例和`opt.computed`开发者定义的`computed`选项，转到`initComputed`函数：

```javascript
const computedWatcherOptions = { computed: true }

function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        `Getter is missing for computed property "${key}".`,
        vm
      )
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      )
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(`The computed property "${key}" is already defined in data.`, vm)
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(`The computed property "${key}" is already defined as a prop.`, vm)
      }
    }
  }
}
```

从这段代码开始我们观察这几部分：

1. 获取计算属性的定义`userDef`和`getter`求值函数

   ```javascript
   const userDef = computed[key]
   const getter = typeof userDef === 'function' ? userDef : userDef.get
   ```

   定义一个计算属性有两种写法，一种是直接跟一个函数，另一种是添加`set`和`get`方法的对象形式，所以这里首先获取计算属性的定义`userDef`，再根据`userDef`的类型获取相应的`getter`求值函数。

2. 计算属性的观察者`watcher`和消息订阅器`dep`

   ```javascript
   watchers[key] = new Watcher(
       vm,
       getter || noop,
       noop,
       computedWatcherOptions
   )
   ```

   这里的`watchers`也就是`vm._computedWatchers`对象的引用，存放了每个计算属性的观察者`watcher`实例（注：后文中提到的“计算属性的观察者”、“订阅者”和`watcher`均指代同一个意思但注意和`Watcher`构造函数区分），`Watcher`构造函数在实例化时传入了4个参数：`vm`实例、`getter`求值函数、`noop`空函数、`computedWatcherOptions`常量对象（在这里提供给`Watcher`一个标识`{computed:true}`项，表明这是一个计算属性而不是非计算属性的观察者，我们来到`Watcher`构造函数的定义：

   ```javascript
   class Watcher {
     constructor (
       vm: Component,
       expOrFn: string | Function,
       cb: Function,
       options?: ?Object,
       isRenderWatcher?: boolean
     ) {
       if (options) {
         this.computed = !!options.computed
       } 
   
       if (this.computed) {
         this.value = undefined
         this.dep = new Dep()
       } else {
         this.value = this.get()
       }
     }
     
     get () {
       pushTarget(this)
       let value
       const vm = this.vm
       try {
         value = this.getter.call(vm, vm)
       } catch (e) {
         
       } finally {
         popTarget()
       }
       return value
     }
     
     update () {
       if (this.computed) {
         if (this.dep.subs.length === 0) {
           this.dirty = true
         } else {
           this.getAndInvoke(() => {
             this.dep.notify()
           })
         }
       } else if (this.sync) {
         this.run()
       } else {
         queueWatcher(this)
       }
     }
   
     evaluate () {
       if (this.dirty) {
         this.value = this.get()
         this.dirty = false
       }
       return this.value
     }
   
     depend () {
       if (this.dep && Dep.target) {
         this.dep.depend()
       }
     }
   }
   ```

   为了简洁突出重点，这里我手动去掉了我们暂时不需要关心的代码片段。
   观察`Watcher`的`constructor`，结合刚才讲到的`new Watcher`传入的第四个参数`{computed:true}`知道，对于计算属性而言`watcher`会执行`if`条件成立的代码`this.dep = new Dep()，`而`dep`也就是创建了该属性的消息订阅器。

   ```javascript
   export default class Dep {
     static target: ?Watcher;
     subs: Array<Watcher>;
   
     constructor () {
       this.id = uid++
       this.subs = []
     }
   
     addSub (sub: Watcher) {
       this.subs.push(sub)
     }
   
     depend () {
       if (Dep.target) {
         Dep.target.addDep(this)
       }
     }
   
     notify () {
       const subs = this.subs.slice()
       for (let i = 0, l = subs.length; i < l; i++) {
         subs[i].update()
       }
     }
   }
   
   Dep.target = null
    
   ```

   `dep`同样精简了部分代码，我们观察`Watcher`和`dep`的关系，用一句话总结

   > `watcher`中实例化了`dep`并向`dep.subs`中添加了订阅者，`dep`通过`notify`遍历了`dep.subs`通知每个`watcher`更新。

3. `defineComputed`定义计算属性

   ```javascript
   if (!(key in vm)) {
     defineComputed(vm, key, userDef)
   } else if (process.env.NODE_ENV !== 'production') {
     if (key in vm.$data) {
       warn(`The computed property "${key}" is already defined in data.`, vm)
     } else if (vm.$options.props && key in vm.$options.props) {
       warn(`The computed property "${key}" is already defined as a prop.`, vm)
     }
   }
   ```

   因为`computed`属性是直接挂载到实例对象中的，所以在定义之前需要判断对象中是否已经存在重名的属性，`defineComputed`传入了三个参数：`vm`实例、计算属性的`key`以及`userDef`计算属性的定义（对象或函数）。
   然后继续找到`defineComputed`定义处：

   ```javascript
   export function defineComputed (
     target: any,
     key: string,
     userDef: Object | Function
   ) {
     const shouldCache = !isServerRendering()
     if (typeof userDef === 'function') {
       sharedPropertyDefinition.get = shouldCache
         ? createComputedGetter(key)
         : userDef
       sharedPropertyDefinition.set = noop
     } else {
       sharedPropertyDefinition.get = userDef.get
         ? shouldCache && userDef.cache !== false
           ? createComputedGetter(key)
           : userDef.get
         : noop
       sharedPropertyDefinition.set = userDef.set
         ? userDef.set
         : noop
     }
     if (process.env.NODE_ENV !== 'production' &&
         sharedPropertyDefinition.set === noop) {
       sharedPropertyDefinition.set = function () {
         warn(
           `Computed property "${key}" was assigned to but it has no setter.`,
           this
         )
       }
     }
     Object.defineProperty(target, key, sharedPropertyDefinition)
   }
   ```

   在这段代码的最后调用了原生`Object.defineProperty`方法，其中传入的第三个参数是属性描述符`sharedPropertyDefinition`，初始化为：

   ```javascript
   const sharedPropertyDefinition = {
     enumerable: true,
     configurable: true,
     get: noop,
     set: noop
   }
   ```

   随后根据`Object.defineProperty`前面的代码可以看到`sharedPropertyDefinition`的`get/set`方法在经过`userDef`和 `shouldCache`等多重判断后被重写，当非服务端渲染时，`sharedPropertyDefinition`的`get`函数也就是`createComputedGetter(key)`的结果，我们找到`createComputedGetter`函数调用结果并最终改写`sharedPropertyDefinition`大致呈现如下：

   ```javascript
   sharedPropertyDefinition = {
       enumerable: true,
       configurable: true,
       get: function computedGetter () {
           const watcher = this._computedWatchers && this._computedWatchers[key]
           if (watcher) {
               watcher.depend()
               return watcher.evaluate()
           }
       },
       set: userDef.set || noop
   }
   ```

   当计算属性被调用时便会执行`get`访问函数，从而关联上观察者对象`watcher`。

------

分析完以上步骤，我们再来梳理下整个流程：

1. 当组件初始化的时候，`computed`和`data`会分别建立各自的响应系统，`Observer`遍历`data`中每个属性设置`get/set`数据拦截
2. 初始化`computed`会调用`initComputed`函数
   1. 注册一个`watcher`实例，并在内实例化一个`Dep`消息订阅器用作后续收集依赖（比如渲染函数的`watcher`或者其他观察该计算属性变化的`watcher`）
   2. 调用计算属性时会触发其`Object.defineProperty`的`get`访问器函数
   3. 调用`watcher.depend()`方法向自身的消息订阅器`dep`的`subs`中添加其他属性的`watcher`
   4. 调用`watcher`的`evaluate`方法（进而调用`watcher`的`get`方法）让自身成为其他`watcher`的消息订阅器的订阅者，首先将`watcher`赋给`Dep.target`，然后执行`getter`求值函数，当访问求值函数里面的属性（比如来自`data`、`props`或其他`computed`）时，会同样触发它们的`get`访问器函数从而将该计算属性的`watcher`添加到求值函数中属性的`watcher`的消息订阅器`dep`中，当这些操作完成，最后关闭`Dep.target`赋为`null`并返回求值函数结果。
3. 当某个属性发生变化，触发`set`拦截函数，然后调用自身消息订阅器`dep`的`notify`方法，遍历当前`dep`中保存着所有订阅者`wathcer`的`subs`数组，并逐个调用`watcher`的 `update`方法，完成响应更新。

## 3、watch & computed

当然很多时候我们使用`computed`时往往会与Vue中另一个API也就是侦听器`watch`相比较，因为在某些方面它们是一致的，都是以Vue的依赖追踪机制为基础，当某个依赖数据发生变化时，所有依赖这个数据的相关数据或函数都会自动发生变化或调用。

> 虽然计算属性在大多数情况下更合适，但有时也需要一个自定义的侦听器。这就是为什么 Vue 通过 `watch` 选项提供了一个更通用的方法来响应数据的变化。当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的。

从vue官方文档对`watch`的解释我们可以了解到，使用 `watch` 选项允许我们执行异步操作 (访问一个API)或高消耗性能的操作，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态，而这些都是计算属性无法做到的。

##### 下面还另外总结了几点关于`computed`和`watch`的差异：

1. `computed`是计算一个新的属性，并将该属性挂载到vm（Vue实例）上，而`watch`是监听已经存在且已挂载到`vm`上的数据，所以用`watch`同样可以监听`computed`计算属性的变化（其它还有`data`、`props`）
2. `computed`本质是一个惰性求值的观察者，具有缓存性，只有当依赖变化后，第一次访问 `computed` 属性，才会计算新的值，而`watch`则是当数据发生变化便会调用执行函数
3. 从使用场景上说，`computed`适用一个数据被多个数据影响，而`watch`适用一个数据影响多个数据；

以上我们了解了`computed`和`watch`之间的一些差异和使用场景的区别，当然某些时候两者并没有那么明确严格的限制，最后还是要具体到不同的业务进行分析。