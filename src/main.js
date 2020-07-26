import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
import axios from 'axios';
import 'store';
// import VueSlideoutPanel from 'vue2-slideout-panel';
import VModal from 'vue-js-modal'

Vue.config.productionTip = false;

Vue.use(VXETable);
Vue.use(VModal);

axios.interceptors.request.use(
    config => {
        if (localStorage.getItem('Authorization')) {
            config.headers.Authorization = localStorage.getItem('Authorization');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
});

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')


