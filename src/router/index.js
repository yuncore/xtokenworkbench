import Vue from 'vue'
import Router from 'vue-router'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
/*admin*/
import Admin from '../views/admin/Admin.vue'
import AdminLogin from '../views/admin/AdminLogin.vue'
import GroupManagement from '../views/admin/GroupManagement.vue'
import TagManagement from '../views/admin/TagManagement.vue'
/*currency detail*/
import CurrencyList from '../views/currency/CurrencyListNew.vue'
import HistoryCurrencyRank from '../views/currency/HistoryCurrencyRank.vue'
import CurrencyDetail from '../views/currency/CurrencyDetail.vue'
import TradeHistory from '../views/trade/TradeHistory'
import PriceContrast from '../views/currency/PriceContrast'
import Detail from '../views/details/Detail'
import DetailOverview from '../views/details/children/Overview'
import Charts from '../views/details/children/Charts'
import Github from '../views/details/children/Github'
import Reddit from '../views/details/children/Reddit'
import Bitcointalk from '../views/details/children/Bitcointalk'
import Other from '../views/details/children/Other'
import Event from '../views/details/children/Events'
/*event*/
import EventAdd from '../views/event/EventAdd.vue'
import EventDetail from '../views/event/EventDetail.vue'
import EventList from '../views/event/EventList.vue'
import WhitePaperUpload from '../views/other/UploadPdf.vue'
/*predict*/
import Predict from '../views/predict/PredictRankList.vue'
import PredictDetail from '../views/predict/PredictDetailList.vue'
import KeyWordStat from '../views/kol-keyword/KeyWordStat.vue'
/*setting*/
import Setting from '../views/profile/Setting'
import APIKey from '../views/profile/children/APIKey'
import Password from '../views/profile/children/Password'
import Profile from '../views/profile/children/Profile'
/*manage*/
import Manage from '../views/manage/Manage'
import TagManage from '../views/manage/children/TagManage'
import GroupManage from '../views/manage/children/GroupManage'
/*other*/
import KolOverView from '../views/kol-keyword/KolOverView.vue'
import BttUserHistory from '../views/kol-keyword/BTTUserHistory.vue'
import DummyPage from '../views/other/DummyPage.vue'
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
                    path: 'admin',
                    name: 'admin',
                    component: Admin
                },
                {
                    path: 'currency/list',
                    name: 'currencyList',
                    component: CurrencyList,
                },
                {
                    path: 'currency/detail',
                    name: 'CurrencyDetail',
                    component: CurrencyDetail
                },
                {
                    path: 'detail',
                    name: 'currency_detail',
                    component: Detail,
                    redirect: '/index/detail/overview',
                    children: [
                        {
                            path: 'overview',
                            name: 'currency_overview',
                            component: DetailOverview
                        },
                        {
                            path: 'charts',
                            name: 'currency_charts',
                            component: Charts
                        },
                        {
                            path: 'github',
                            name: 'currency_github',
                            component: Github
                        },
                        {
                            path: 'reddit',
                            name: 'currency_reddit',
                            component: Reddit
                        },
                        {
                            path: 'bitcointalk',
                            name: 'currency_bitcointalk',
                            component: Bitcointalk
                        },
                        {
                            path: 'other',
                            name: 'currency_other',
                            component: Other
                        },
                        {
                            path: 'event',
                            name: 'currency_event',
                            component: Event
                        }
                    ]
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
                },
                {
                    name: 'manage',
                    path: 'manage',
                    redirect: '/index/manage/tag',
                    component: Manage,
                    children: [
                        {
                            name: 'tag-manage',
                            path: 'tag',
                            component: TagManage
                        },
                        {
                            name: 'group-manage',
                            path: 'group',
                            component: GroupManage
                        }
                    ]
                }
            ]
        },

    ]
})
