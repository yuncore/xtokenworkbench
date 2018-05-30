import Vue from 'vue'
import Vuex from 'vuex'
import config from '../assets/js/config'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        name: sessionStorage.getItem('name') || '',
        icon: sessionStorage.getItem('icon') || ''
    },
    getters: {
        name: state => {
            if(state.name){
                return state.name
            }else{
                return 'yourName'
            }
        },
        icon: state => {
            if(state.icon){
                return config.IMGDOMAIN + state.icon
            }else{
                return 'static/img/ava-default.svg'
            }
        }
    },
    mutations: {
        setUserName(state, payload){
            sessionStorage.setItem('name', payload.name);
            state.name = payload.name
        },
        setIcon(state, payload){
            sessionStorage.setItem('icon', payload.icon);
            state.icon = payload.icon
        }
    },
})
