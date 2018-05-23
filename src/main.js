// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import VueI18n from 'vue-i18n'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n);
Vue.use(ElementUI, {locale});
Vue.config.productionTip = false;

const i18n = new VueI18n({
    locale: 'EN', // 语言标识
    messages: {
        'ZH': require('./assets/common/lang/zh'),   // 中文语言包
        'EN': require('./assets/common/lang/en')    // 英文语言包
    },
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    template: '<App/>',
    components: {App}
});

router.beforeEach((to, from, next) => {
    if (to.path !== '/login' && to.path !== '/adminLogin' && to.path !== '/register') {
        let token = sessionStorage.getItem('token');
        if (!token) {
            next({path: '/login'})
        } else {
            next()
        }
    } else {
        next()
    }
});

