import Vue from 'vue'
import Router from 'vue-router'

import CurrencyList from '../views/currency/CurrencyList.vue'
import CurrencyDetail from '../views/currency/CurrencyDetail.vue'
import EventAdd from '../views/event/EventAdd.vue'
import EventDetail from '../views/event/EventDetail.vue'
import EventList from '../views/event/EventList.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import WhitePaperUpload from '../views/other/UploadPdf.vue'
import Admin from '../views/admin/Admin.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import KeyWordStat from '../views/kol-keyword/KeyWordStat.vue'
import KolOverView from '../views/kol-keyword/KolOverView.vue'
import BttUserHistory from '../views/kol-keyword/BTTUserHistory.vue'
import HistoryCurrencyRank from '../views/currency/HistoryCurrencyRank.vue'
import TagManagement from '../views/admin/TagManagement.vue'
import DummyPage from '../views/other/DummyPage.vue'
import Predict from '../views/predict/PredictRankList.vue'
import PredictDetail from '../views/predict/PredictDetailList.vue'
import GroupManagement from '../views/admin/GroupManagement.vue'
import TradeHistory from '../views/trade/TradeHistory'
import Setting from '../views/profile/Setting'
import APIKey from '../views/profile/children/APIKey'
import Password from '../views/profile/children/Password'
import Profile from '../views/profile/children/Profile'
import PriceContrast from '../views/currency/PriceContrast'
import Main from '../views/Main'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/adminLogin',
            name: 'AdminLogin',
            component: AdminLogin
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/index',
            name: 'main',
            component: Main,
            redirect: '/index/currency/list',
            children: [
                {
                    path: 'currency/list',
                    name: 'currencyList',
                    component: CurrencyList,
                },
                {
                    path: 'admin',
                    name: 'admin',
                    component: Admin
                },
                {
                    path: 'currency/detail',
                    name: 'CurrencyDetail',
                    component: CurrencyDetail
                },
                {
                    path: 'event/add',
                    name: 'EventAdd',
                    component: EventAdd
                },
                {
                    path: 'event/detail',
                    name: 'EventDetail',
                    component: EventDetail
                },
                {
                    path: 'event/list',
                    name: 'EventList',
                    component: EventList
                },
                {
                    path: 'whitepaper/upload',
                    name: 'whitePaperUpload',
                    component: WhitePaperUpload
                },
                {
                    path: 'keyword',
                    name: 'keywords',
                    component: KeyWordStat
                },
                {
                    path: 'kol',
                    name: 'kol',
                    component: KolOverView
                },
                {
                    path: 'btt/user/history',
                    name: 'btt_user_history',
                    component: BttUserHistory
                },
                {
                    path: 'history/rank',
                    name: 'history_rank',
                    component: HistoryCurrencyRank
                },
                {
                    path: 'tagManagement',
                    name: 'tag_management',
                    component: TagManagement
                },
                {
                    path: 'dummy',
                    component: DummyPage
                },
                {
                    path: 'predict',
                    name: 'predict',
                    component: Predict
                },
                {
                    path: 'predictDetail',
                    name: 'predict_detail',
                    component: PredictDetail
                },
                {
                    path: 'groupManagement',
                    name: 'group_management',
                    component: GroupManagement
                },
                {
                    name: 'trade_history',
                    path: 'tradeHistory',
                    component: TradeHistory,
                },
                {
                    name: 'price_contrast',
                    path: 'priceContrast',
                    component: PriceContrast
                },
                {
                    name: 'setting',
                    path: 'setting',
                    component: Setting,
                    redirect: '/index/setting/profile',
                    children: [
                        {
                            name: 'setting-apiKey',
                            path: 'apikey',
                            component: APIKey,
                        },
                        {
                            name: 'setting-index',
                            path: 'profile',
                            component: Profile,
                        },
                        {
                            name: 'setting-password',
                            path: 'password',
                            component: Password,
                        }
                    ]
                }
            ]
        },

    ]
})
