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
import Profile from '../views/profile/Profile'
import Main from '../views/Main'

Vue.use(Router)

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
            path: '/main',
            component: Main,
            children: [
                {
                    path: '/index',
                    name: 'currencyList',
                    component: CurrencyList
                },
                {
                    path: '/admin',
                    component: Admin
                },
                {
                    path: '/currency',
                    name: 'CurrencyDetail',
                    component: CurrencyDetail
                },
                {
                    path: '/event/add',
                    name: 'EventAdd',
                    component: EventAdd
                },
                {
                    path: '/event/detail',
                    name: 'EventDetail',
                    component: EventDetail
                },
                {
                    path: '/event/list',
                    name: 'EventList',
                    component: EventList
                },
                {
                    path: '/whitepaper/upload',
                    name: 'whitePaperUpload',
                    component: WhitePaperUpload
                },
                {
                    path: '/keyword',
                    name: 'keywords',
                    component: KeyWordStat
                },
                {
                    path: '/kol',
                    name: 'kol',
                    component: KolOverView
                },
                {
                    path: '/btt/user/history',
                    name: 'btt_user_history',
                    component: BttUserHistory
                },
                {
                    path: '/history/rank',
                    name: 'history_rank',
                    component: HistoryCurrencyRank
                },
                {
                    path: '/tagManagement',
                    name: 'tag_management',
                    component: TagManagement
                },
                {
                    path: '/dummy',
                    component: DummyPage
                },
                {
                    path: '/predict',
                    name: 'predict',
                    component: Predict
                },
                {
                    path: '/predictDetail',
                    name: 'predict_detail',
                    component: PredictDetail
                },
                {
                    path: '/groupManagement',
                    name: 'group_management',
                    component: GroupManagement
                },
                {
                    name: 'trade_history',
                    path: '/tradeHistory',
                    component: TradeHistory,
                },
                {
                    name: 'profile',
                    path: '/profile',
                    component: Profile,
                    children: [
                        {
                            name: 'binance',
                            path: '/binance',
                            component: '',
                        }
                    ]
                }
            ]
        },

    ]
})
