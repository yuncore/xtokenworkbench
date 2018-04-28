import Vue from 'vue'
import Router from 'vue-router'

import CurrencyList from '../views/CurrencyList.vue'
import CurrencyDetail from '../views/CurrencyDetail.vue'
import EventAdd from '../views/EventAdd.vue'
import EventDetail from '../views/EventDetail.vue'
import EventList from '../views/EventList.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import WhitePaperUpload from '../views/uploadPdf.vue'
import Admin from '../views/Admin.vue'
import AdminLogin from '../views/AdminLogin.vue'
import KeyWordStat from '../views/KeyWordStat.vue'
import KolOverView from '../views/kolOverView.vue'
import BttUserHistory from '../views/BTTUserHistory.vue'
import HistoryCurrencyRank from '../views/HistoryCurrencyRank.vue'
import TagManagement from '../views/TagManagement.vue'
import DummyPage from '../views/DummyPage.vue'
import Predict from '../views/PredictRankList.vue'
import PredictDetail from '../views/PredictDetailList.vue'
import GroupManagement from '../views/groupManagement.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
          path: '/',
          redirect: '/login'
        },
        {
            path: '/admin',
            component: Admin
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
            name: 'currencyList',
            component: CurrencyList
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
            component: Predict
        },
        {
            path: '/predictDetail',
            component: PredictDetail
        },
        {
            path: '/groupManagement',
            name: 'group_management',
            component: GroupManagement
        }
    ]
})
