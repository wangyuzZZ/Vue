import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        name:'悟空'
    },
    mutations: { //修改数据仓库的事件
        changeName(state,name){
            state.name = name
        }
    },
    actions: { //推荐使用的异步修改数据仓库
        actionsChange(a,name) {
            a.commit('changeName',name)
        }
    }
})