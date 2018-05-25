<template>
    <div>
        <div id="window" class="flip" :style="{height: this.pageType === 'login' ? '450px' : '600px'}">
            <div class="page page-front">
                <div class="page-content">
                    <div>
                        <div class="input-row">
                            <h3 style="text-align: center" :class="[{fadeIn: first}, {delay1: first}]">{{$t('page.login.t5')}}</h3>
                        </div>
                        <div class="input-row">
                            <label :class="[{fadeIn: first} , 'label']">{{$t('page.login.t1')}}</label>
                            <input v-model.trim="phone" type="text" :class="[{fadeIn: first}, {delay1: first}, 'input']">
                        </div>
                        <div class="input-row password">
                            <label :class="[{fadeIn: first}, {delay2: first} , 'label']">{{$t('page.login.t2')}}</label>
                            <span class="btn label"  style="display:none;">{{$t('page.login.t3')}}</span>
                            <input v-model.trim="password" type="password" :class="[{fadeIn: first}, {delay3: first} , 'input']">
                        </div>
                        <div class="input-row perspective">
                            <button @click="login" :class="[{fadeIn: first}, {delay4: first}, {loading: loading}, 'button', 'load-btn']">
                                <span class="default"><i class="ion-arrow-right-b"></i>{{$t('page.login.t4')}}</span>
                                <div class="load-state">
                                    <div class="ball"></div>
                                    <div class="ball"></div>
                                    <div class="ball"></div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <iframe name="riliIframe" style="width: 100%; height: 100%; position:fixed; z-index: -1;" marginwidth="0"
                scrolling="no" marginheight="0" frameborder="no" border="0"
                src="static/html/biods.html">
        </iframe>
    </div>
</template>
<script>
    import net_util from '../../assets/js/net_utils'
    import config from '../../assets/js/config'
    export default {
        data: function () {
            return {
                pageType: 'login',
                password: "",
                checkPassword: '',
                phone: '',
                name: '',
                first: true,
                loading: false,
            }
        },
        watch: {
            pageType(){
                this.password = ''
                this.checkPassword = ''
                this.phone = ''
            }
        },
        methods:{
            login(e){
                e.preventDefault()
                let url = config.JAVABASEDOMAIN + '/user/site/login/admin'
                if(this.phone === ''){
                    this.$message({type: 'warning', message: this.$t('alert.a1')})
                    return
                }
                if(this.password === ''){
                    this.$message({type: 'warning', message: this.$t('alert.a2')})
                    return
                }
                if(!this.validateMobile(this.phone)){
                    return
                }
                let data = {
                    phone: this.phone ,
                    pwd: this.password,
                }
                let succ = res => {
                    this.loading = false
                    if(!res.errorMsg){
                        this.$message({type: 'success', message: this.$t('alert.a3')})
                        let token = res.result.adminToken
                        sessionStorage.setItem('token', token)
                        setTimeout( () => {
                            this.$router.push({name: 'admin'})
                        }, 1000)
                    }else{
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.loading = false
                    this.$message({type: 'error', message: this.$t('alert.a4')})
                }
                this.loading = true
                setTimeout( () => {
                    net_util.getRequest(url, data, succ, fail, false, "admin")
                }, 1000)
            },
            // not used
            register(e){
                e.preventDefault()
                let url = config.JAVABASEDOMAIN + '/user/register'
                if(this.phone === ''){
                    this.$message({type: 'warning', message: '手机号不能为空'})
                    return
                }
                if(!this.validateMobile(this.phone)){
                    return
                }
                if(this.password === ''){
                    this.$message({type: 'warning', message: '密码不能为空'})
                    return
                }
                if(this.name === ''){
                    this.$message({type: 'warning', message: '请填写姓名'})
                    return
                }
                if(this.password !== this.checkPassword){
                    this.$message({type: 'warning', message: '密码不一致'})
                    return
                }
                let data = {
                    phone: this.phone,
                    pwd: this.password,
                    name: this.name
                }
                let succ = res => {
                    this.loading = false
                    if(!res.errorMsg){
                        this.pageType = 'login'
                        this.$message({type: 'success', message: '注册成功，请等待审核'})
                    }else{
                        this.$message({type: 'error', message: res.errorMsg})
                    }
                }
                let fail = res => {
                    this.loading = false
                    this.$message({type: 'error', message: '连接失败'})
                }
                this.loading = true
                setTimeout( () => {
                    net_util.getRequest(url, data, succ, fail)
                }, 1000)
            },
            validateMobile(mobile){
                let msg = ''
                if(mobile.length === 0){
                    msg = this.$t('alert.a5')
                }else if(mobile.length !== 11){
                    msg = this.$t('alert.a5')
                }else{
                    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
                    if(!myreg.test(mobile)){
                        msg = this.$t('alert.a5')
                    }
                }
                if(msg !== ''){
                    this.$message({type: 'warning', message: msg})
                }
                return msg === ''
            }
        },
        mounted(){
            var win = $('#window');
            win.removeClass('flip');
        }
    }
</script>
<style scoped>

    *, *::after, *::before {
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
    }

    .rotateplane-enter-active {
        animation: rotateplane .5s;
    }
    .rotateplane-leave-active {
        animation: rotateplane .5s reverse;
    }

    #window .page-content .tip{
        text-align: center;
        color: #b2b2b2;
        font-size: 12px;
    }

    #window .page-content .tip .btn{
        text-decoration: underline;
        cursor: pointer;
    }

    #window .password .label{
        display: inline-block;
    }

    #window .password .btn{
        font-size: 12px;
        cursor: pointer;
        text-decoration: underline;
        color: #b2b2b2;
    }

    #window .password .btn:hover{
        color: #ffffff;
    }

    #window .page-content .tip .btn:hover{
        color: #ffffff;
    }

    #window {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        height: 580px;
        width: 450px;
        color: #FFF;
        -webkit-animation: 1.5s window ease-in-out backwards;
        -moz-animation: 1.5s window ease-in-out backwards;
        animation: 1.5s window ease-in-out backwards;
        -moz-transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
        -moz-transition-property: height, width;
        -o-transition-property: height, width;
        -webkit-transition-property: height, width;
        transition-property: height width;
    }
    #window, #window .page, #window .page-content {
        -moz-transition-duration: .3s;
        -o-transition-duration: .3s;
        -webkit-transition-duration: .3s;
        transition-duration: .3s;
    }
    #window.flip {
        height: 460px;
        width: 350px;
    }
    #window.flip .page-front {
        -moz-transform: rotateX(180deg);
        -ms-transform: rotateX(180deg);
        -webkit-transform: rotateX(180deg);
        transform: rotateX(180deg);
    }
    #window.flip .page-back {
        -moz-transform: rotateX(360deg);
        -ms-transform: rotateX(360deg);
        -webkit-transform: rotateX(360deg);
        transform: rotateX(360deg);
    }
    #window.flip .page-back .page-content {
        opacity: 1;
    }
    #window.flip .page-back .avatar, #window.flip .page-back .welcome, #window.flip .page-back .perspective {
        opacity: 1;
        -moz-transform: none;
        -ms-transform: none;
        -webkit-transform: none;
        transform: none;
        -moz-transition-duration: 0.6s;
        -o-transition-duration: 0.6s;
        -webkit-transition-duration: 0.6s;
        transition-duration: 0.6s;
    }
    #window.flip .page-back .avatar {
        -moz-transition-delay: 0.8s;
        -o-transition-delay: 0.8s;
        -webkit-transition-delay: 0.8s;
        transition-delay: 0.8s;
    }
    #window.flip .page-back .welcome {
        -moz-transition-delay: 0.8s;
        -o-transition-delay: 0.8s;
        -webkit-transition-delay: 0.8s;
        transition-delay: 0.8s;
    }
    #window.flip .page-back .perspective {
        -moz-transition-delay: 0.9s;
        -o-transition-delay: 0.9s;
        -webkit-transition-delay: 0.9s;
        transition-delay: 0.9s;
    }
    #window .page {
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        -moz-transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
        -moz-backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        background: rgba(0, 0, 0, 0.4);
        -moz-border-radius: 6px;
        -webkit-border-radius: 6px;
        border-radius: 6px;
        padding: 60px;
    }
    #window .page-back {
        text-align: center;
        -moz-transform: rotateX(180deg);
        -ms-transform: rotateX(180deg);
        -webkit-transform: rotateX(180deg);
        transform: rotateX(180deg);
    }
    #window .page-back .page-content {
        opacity: 0;
    }
    #window .page-back .avatar {
        height: 150px;
        width: 150px;
        border: 5px solid #FFF;
        margin: 30px auto 40px auto;
        display: block;
        opacity: 0;
        -moz-transform: scale(0.1);
        -ms-transform: scale(0.1);
        -webkit-transform: scale(0.1);
        transform: scale(0.1);
        -moz-border-radius: 1000px;
        -webkit-border-radius: 1000px;
        border-radius: 1000px;
    }
    #window .page-back .welcome {
        font-size: 22px;
        margin-bottom: 40px;
    }
    #window .page-back .welcome, #window .page-back .perspective {
        opacity: 0;
        -moz-transform: translateY(-30px);
        -ms-transform: translateY(-30px);
        -webkit-transform: translateY(-30px);
        transform: translateY(-30px);
    }
    #window .input-row {
        margin: 0 0 30px;
    }
    #window .input-row:last-of-type {
        margin-bottom: 0;
    }
    #window .perspective {
        -moz-perspective: 1000px;
        -webkit-perspective: 1000px;
        perspective: 1000px;
    }
    #window .label {
        font-family: sans-serif;
        text-transform: uppercase;
        font-size: 12px;
        margin: 0 0 10px 0;
        color: #FFF;
        display: block;
        cursor: pointer;
    }
    #window .input {
        padding: 0 15px;
        height: 40px;
        line-height: 40px;
        outline: none;
        border: 0;
        background: #FFF;
        display: block;
        width: 100%;
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        -moz-transition-duration: 0.2s;
        -o-transition-duration: 0.2s;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
    }
    #window .input:focus, #window .input.fyll-focus {
        -moz-box-shadow: 0 0 0 3px #008aff;
        -webkit-box-shadow: 0 0 0 3px #008aff;
        box-shadow: 0 0 0 3px #008aff;
    }
    #window .button {
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        margin: 0;
        text-align: center;
        color: #FFF;
        border: 0;
        display: block;
        width: 100%;
        outline: none;
        cursor: pointer;
        overflow: hidden;
        font-size: 17px;
        background: #D85C89;
        -moz-border-radius: 3px;
        -webkit-border-radius: 3px;
        border-radius: 3px;
        background-image: -moz-linear-gradient(bottom, #008aff, #008aff);
        background-image: -webkit-linear-gradient(bottom, #d85c89, #008aff);
        background-image: linear-gradient(to top, #008aff, #008aff);
        -moz-box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 0 0 4px rgba(0, 0, 0, 0.5);
        -webkit-box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 0 0 4px rgba(0, 0, 0, 0.5);
        box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.4), 0 0 4px rgba(0, 0, 0, 0.5);
        -moz-transition-duration: 0.1s;
        -o-transition-duration: 0.1s;
        -webkit-transition-duration: 0.1s;
        transition-duration: 0.1s;
        -moz-transform-style: preserve-3d;
        -webkit-transform-style: preserve-3d;
        transform-style: preserve-3d;
        -moz-transform-origin: bottom 50%;
        -ms-transform-origin: bottom 50%;
        -webkit-transform-origin: bottom 50%;
        transform-origin: bottom 50%;
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        -moz-backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }
    #window .button i {
        margin-right: 10px;
    }
    #window .button:active, #window .button.fyll-focus {
        background: #008aff;
        background-image: -moz-linear-gradient(bottom, #008aff, #008aff);
        background-image: -webkit-linear-gradient(bottom, #008aff, #008aff);
        background-image: linear-gradient(to top, #008aff, #008aff);
        -moz-transform: rotateX(20deg);
        -ms-transform: rotateX(20deg);
        -webkit-transform: rotateX(20deg);
        transform: rotateX(20deg);
    }
    #window .button.inline {
        width: auto;
        display: inline-block;
    }
    #window .button.load-btn .default, #window .button.load-btn .load-state {
        -moz-transition-duration: 0.2s;
        -o-transition-duration: 0.2s;
        -webkit-transition-duration: 0.2s;
        transition-duration: 0.2s;
    }
    #window .button.load-btn .load-state {
        position: absolute;
        top: -50px;
        left: 0;
        right: 0;
        height: 100%;
        text-align: center;
        line-height: 50px;
        pointer-events: none;
    }
    #window .button.load-btn .load-state .ball {
        height: 10px;
        width: 10px;
        margin-right: 10px;
        background: #FFF;
        display: inline-block;
        -moz-border-radius: 1000px;
        -webkit-border-radius: 1000px;
        border-radius: 1000px;
        -webkit-animation: ballBounce 0.3s alternate infinite;
        -moz-animation: ballBounce 0.3s alternate infinite;
        animation: ballBounce 0.3s alternate infinite;
        -webkit-animation-timing-function: cubic-bezier(0.2, 0.4, 0.3, 1);
        -moz-animation-timing-function: cubic-bezier(0.2, 0.4, 0.3, 1);
        animation-timing-function: cubic-bezier(0.2, 0.4, 0.3, 1);
        -moz-transition-duration: 0.3s;
        -o-transition-duration: 0.3s;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
    }
    #window .button.load-btn .load-state .ball:nth-child(2n) {
        -webkit-animation-delay: 0.05s;
        -moz-animation-delay: 0.05s;
        animation-delay: 0.05s;
    }
    #window .button.load-btn .load-state .ball:nth-child(3n) {
        -webkit-animation-delay: 0.1s;
        -moz-animation-delay: 0.1s;
        animation-delay: 0.1s;
    }
    #window .button.load-btn .load-state .ball:last-child {
        margin-right: 0;
    }
    #window .button.load-btn.done .ball {
        opacity: 0;
    }
    #window .button.load-btn.loading .default {
        -moz-transform: translateY(50px);
        -ms-transform: translateY(50px);
        -webkit-transform: translateY(50px);
        transform: translateY(50px);
        opacity: 0;
    }
    #window .button.load-btn.loading .load-state {
        -moz-transform: translateY(50px);
        -ms-transform: translateY(50px);
        -webkit-transform: translateY(50px);
        transform: translateY(50px);
    }

    .fadeIn {
        -webkit-animation: 1s fadeIn cubic-bezier(0.015, 0.695, 0.34, 1.365) backwards;
        -moz-animation: 1s fadeIn cubic-bezier(0.015, 0.695, 0.34, 1.365) backwards;
        animation: 1s fadeIn cubic-bezier(0.015, 0.695, 0.34, 1.365) backwards;
        -webkit-animation-delay: 1.5s;
        -moz-animation-delay: 1.5s;
        animation-delay: 1.5s;
    }

    .delay1 {
        -webkit-animation-delay: 1.6s;
        -moz-animation-delay: 1.6s;
        animation-delay: 1.6s;
    }

    .delay2 {
        -webkit-animation-delay: 1.7s;
        -moz-animation-delay: 1.7s;
        animation-delay: 1.7s;
    }

    .delay3 {
        -webkit-animation-delay: 1.8s;
        -moz-animation-delay: 1.8s;
        animation-delay: 1.8s;
    }

    .delay4 {
        -webkit-animation-delay: 1.9s;
        -moz-animation-delay: 1.9s;
        animation-delay: 1.9s;
    }

    @-webkit-keyframes rotateplane {
        0% {
            -webkit-transform:perspective(220px);
        }
        50% {
            -webkit-transform:perspective(220px) rotateY(180deg);
        }
        100% {
            -webkit-transform:perspective(220px) rotateY(180deg) rotateX(180deg);
        }
    }
    @keyframes rotateplane {
        0% {
            transform:perspective(120px) rotateY(0) rotateX(0);
            -webkit-transform:perspective(220px) rotateY(0) rotateX(0);
        }
        50% {
            transform:perspective(120px) rotateY(0) rotateX(-180.1deg);
            -webkit-transform:perspective(220px) rotateY(0) rotateX(-180.1deg);
        }
        100% {
            transform:perspective(120px) rotateY(-179.9deg) rotateX(-180deg);
            -webkit-transform:perspective(220px) rotateY(-179.9deg) rotateX(-180deg);
        }
    }

    @-webkit-keyframes window {
        0% {
            -moz-transform: scale(0) rotateX(360deg);
            -ms-transform: scale(0) rotateX(360deg);
            -webkit-transform: scale(0) rotateX(360deg);
            transform: scale(0) rotateX(360deg);
            height: 150px;
            width: 150px;
        }

        50% {
            -moz-transform: none;
            -ms-transform: none;
            -webkit-transform: none;
            transform: none;
            height: 150px;
        }

        75% {
            height: 350px;
            width: 150px;
        }

        100% {
            width: 450px;
        }
    }
    @-moz-keyframes window {
        0% {
            -moz-transform: scale(0) rotateX(360deg);
            -ms-transform: scale(0) rotateX(360deg);
            -webkit-transform: scale(0) rotateX(360deg);
            transform: scale(0) rotateX(360deg);
            height: 150px;
            width: 150px;
        }

        50% {
            -moz-transform: none;
            -ms-transform: none;
            -webkit-transform: none;
            transform: none;
            height: 150px;
        }

        75% {
            height: 350px;
            width: 150px;
        }

        100% {
            width: 450px;
        }
    }
    @keyframes window {
        0% {
            -moz-transform: scale(0) rotateX(360deg);
            -ms-transform: scale(0) rotateX(360deg);
            -webkit-transform: scale(0) rotateX(360deg);
            transform: scale(0) rotateX(360deg);
            height: 150px;
            width: 150px;
        }

        50% {
            -moz-transform: none;
            -ms-transform: none;
            -webkit-transform: none;
            transform: none;
            height: 150px;
        }

        75% {
            height: 350px;
            width: 150px;
        }

        100% {
            width: 450px;
        }
    }
    @-webkit-keyframes fadeIn {
        0% {
            opacity: 0;
            -moz-transform: translateY(30px);
            -ms-transform: translateY(30px);
            -webkit-transform: translateY(30px);
            transform: translateY(30px);
        }

        100% {
            opacity: 1;
            -moz-transform: none;
            -ms-transform: none;
            -webkit-transform: none;
            transform: none;
        }
    }
    @-moz-keyframes fadeIn {
        0% {
            opacity: 0;
            -moz-transform: translateY(30px);
            -ms-transform: translateY(30px);
            -webkit-transform: translateY(30px);
            transform: translateY(30px);
        }

        100% {
            opacity: 1;
            -moz-transform: none;
            -ms-transform: none;
            -webkit-transform: none;
            transform: none;
        }
    }
    @keyframes fadeIn {
        0% {
            opacity: 0;
            -moz-transform: translateY(30px);
            -ms-transform: translateY(30px);
            -webkit-transform: translateY(30px);
            transform: translateY(30px);
        }

        100% {
            opacity: 1;
            -moz-transform: none;
            -ms-transform: none;
            -webkit-transform: none;
            transform: none;
        }
    }
    @-webkit-keyframes ballBounce {
        0% {
            -moz-transform: translateY(25%);
            -ms-transform: translateY(25%);
            -webkit-transform: translateY(25%);
            transform: translateY(25%);
        }

        100% {
            -moz-transform: translateY(-75%);
            -ms-transform: translateY(-75%);
            -webkit-transform: translateY(-75%);
            transform: translateY(-75%);
        }
    }
    @-moz-keyframes ballBounce {
        0% {
            -moz-transform: translateY(25%);
            -ms-transform: translateY(25%);
            -webkit-transform: translateY(25%);
            transform: translateY(25%);
        }

        100% {
            -moz-transform: translateY(-75%);
            -ms-transform: translateY(-75%);
            -webkit-transform: translateY(-75%);
            transform: translateY(-75%);
        }
    }
    @keyframes ballBounce {
        0% {
            -moz-transform: translateY(25%);
            -ms-transform: translateY(25%);
            -webkit-transform: translateY(25%);
            transform: translateY(25%);
        }

        100% {
            -moz-transform: translateY(-75%);
            -ms-transform: translateY(-75%);
            -webkit-transform: translateY(-75%);
            transform: translateY(-75%);
        }
    }


</style>


