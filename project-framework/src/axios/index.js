//引入Axios
import Axios from 'axios'
//mian.js中
import Qs from 'qs'
//配置域名
Axios.defaults.baseURL = 'https://wlport.hjbloc.com/';
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//请求拦截
Axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
export default {
  install(Vue, options) {
    /**
     * post请求
     * url:接口地址
     * data:请求参数
     * callback:回调参数
     */
    Vue.prototype.post = (url, data, callBack) => {
        Axios.post(url, Qs.stringify({
            ...data
          }), {
            //设置请求头
            headers: {
              'token': '123'
            }
          }).then(res => {
            //请求成功返回的值
            callBack && callBack(res)
          })
          .catch(error => {})
      },
      /**
       * get请求
       * url:接口地址
       * data:请求参数
       * callback:回调参数
       */
      Vue.prototype.get = (url, data, callBack) => {
        Axios.get(url, {
            data
          }, ).then(res => {
            //请求成功返回的值
            callBack && callBack(res)
          })
          .catch(error => {})
      }
  }
}
