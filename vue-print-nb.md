## 安装

````shell
npm install --save vue-print-nb
or
yarn add -s vue-print-nb
````

## 引入

```javascript
//main.js
import Print from 'vue-print-nb'
Vue.use(Print);
```

## 使用

```javascript
<div id="printMe" style="background:red;">
        //打印的内容
 </div>
 <button v-print="'#printMe'">Print local range</button>
```

