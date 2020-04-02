```javascript
var utils = {
    a: 'hello',
    b: function(){
        console.log("hello");
    }
}
export default utils
//组件内引用
import Utils from  '../static/util'  // utils.js这个是你要引入的那个js文件
然后就可以这样调用了:
Utils.b()
//全局引用 在main.js文件下
import util from '../static/util'
Vue.prototype.Util = util
//组件内
this.Util.a

```

