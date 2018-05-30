<template>
    <div id="profile">
        <h3>Profile</h3>
        <p>Modifying your profile will be displayed on your business card and will allow more friends to get to know you.</p>
        <div class="avatar-setting">
            <img class="avatar" :src="avatar">
            <el-button @click="showCroppaDia"
                       type="primary"
                       size="mini"
                       class="upload-button">
                upload new picture
            </el-button>
        </div>
        <el-form :model="profileForm"
                 :rules="rules"
                 ref="profileForm"
                 label-position="top"
                 class="profile-form">
            <el-form-item label="Name" prop="name">
                <el-input v-model.trim="profileForm.name"></el-input>
            </el-form-item>
            <el-form-item label="Email" prop="email">
                <el-input v-model.trim="profileForm.email" type="email"></el-input>
            </el-form-item>
            <el-form-item label="Address" prop="address">
                <el-input v-model.trim="profileForm.address"></el-input>
            </el-form-item>
            <el-form-item label="Personal Page" prop="personalPage">
                <el-input v-model.trim="profileForm.personalPage"></el-input>
            </el-form-item>
            <el-form-item label="Bio" prop="intro">
                <el-input  type="textarea"
                           :rows="2"
                           v-model.trim="profileForm.intro">
                </el-input>
            </el-form-item>
            <el-form-item class="operate-button-group">
                <el-button type="primary" @click="submitForm('profileForm', updateUserDetail)">
                    Update Profile
                </el-button>
            </el-form-item>
        </el-form>
        <el-dialog :visible.sync="avatarDialogVisible" width="400px">
            <croppa v-model="croppa"
                    :zoom-speed="10"
                    :prevent-white-space="true"
                    initial-size="natural"
                    class="croppa">
            </croppa>
            <span slot="footer" class="dialog-footer">
                <el-button size="mini" @click="avatarDialogVisible = false">Cancel</el-button>
                <el-button size="mini" type="success" @click="setNewPicture">Set new picture</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import config from '../../../assets/js/config'
    import net_util from '../../../assets/js/net_utils'
    import { mapMutations } from 'vuex'

    export default {
        name: "Profile",
        data(){
            let validateEmail = (rule, value, callback) => {
                let reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
                if(!reg.test(value)){
                    callback(new Error('Incorrect email'))
                }else{
                    callback()
                }
            };
            return {
                croppa: {},
                avatarDialogVisible: false,
                avatar: 'static/img/ava-default.svg',
                profileForm:{
                    name: '',
                    email: '',
                    address: '',
                    personalPage: '',
                    intro: ''
                },
                rules:{
                    name: [
                        {max: 12, min: 0, message: 'name is limited in 12 characters', trigger: 'blur'}
                    ],
                    email: [
                        {validator: validateEmail, trigger: 'blur'}
                    ]
                },
            }
        },
        methods: {
            ...mapMutations(['setUserName', 'setIcon']),
            getUserDetail(){
                return new Promise((resolve, reject) => {
                    let url = config.JAVABASEDOMAIN + `/user/detail`;
                    let succ = res => {
                        if (!res.errorMsg) {
                            let result = res.result;
                            if(result.icon){
                                this.avatar = config.IMGDOMAIN + result.icon;
                                this.setIcon({icon: result.icon})
                            }else{
                                this.avatar = 'static/img/ava-default.svg';
                                this.setIcon({icon: ''})
                            }
                            this.profileForm.name = result.name || '';
                            this.setUserName({name: this.profileForm.name});
                            this.profileForm.email = result.email || '';
                            this.profileForm.address = result.address || '';
                            this.profileForm.personalPage = result.homepage || '';
                            this.profileForm.intro = result.details || '';
                            resolve(result)
                        }else{
                            reject(res)
                        }
                    };
                    let fail = res => {
                        reject(res)
                    };
                    net_util.getRequest(url, {}, succ, fail)
                });
            },
            updateUserDetail(){
                let url = config.JAVABASEDOMAIN + '/user/update/detail';
                let data = {
                    name: this.profileForm.name,
                    address: this.profileForm.address,
                    email: this.profileForm.email,
                    homepage: this.profileForm.personalPage,
                    details: this.profileForm.intro
                };
                let succ = res => {
                    if (!res.errorMsg){
                        this.$message({type: 'success', message: this.$t('success')});
                        this.getUserDetail()
                    }
                };
                let fail = res => {
                    this.$message({type: 'error', message: this.$t('error')})
                };
                net_util.postRequest(url, data, succ, fail)
            },
            showCroppaDia(){
                this.avatarDialogVisible = true
            },
            setNewPicture(){
                this.croppa.generateBlob((blob) => {
                    let formData = new FormData();
                    formData.append('icon', blob);
                    this.uploadImg(formData).then(res => {
                        this.$message({type: 'success', message: this.$t('success')});
                        this.avatarDialogVisible = false;
                        this.croppa = {};
                        this.getUserDetail()
                    }).catch(res => {
                        this.$message({type: 'error', message: this.$t('error')})
                    })
                })
            },
            uploadImg(formData){
                return new Promise((resolve, reject) => {
                    let url = config.JAVABASEDOMAIN + '/user/upload';
                    let data = formData;
                    let succ = res => {
                        if (!res.errorMsg) {
                            resolve(res)
                        }else{
                            reject(res)
                        }
                    };
                    let fail = res => reject(res);
                    net_util.formDataRequest(url, data, succ, fail);
                })
            },
            submitForm(name, cb){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        cb()
                    } else {
                        return false;
                    }
                });
            },
        },
        mounted(){
            this.getUserDetail()
        },
    }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
    #profile
        h3
            margin 0
            font-size 30px
            font-weight normal
        p
            margin-top 5px
            margin-bottom 20px
            font-size 14px
        .operate-button-group
            margin-top 20px
        .avatar-setting
            .avatar
                width 100px
                height 100px
                border-radius 50%
            .upload-button
                margin-left 10px
        .croppa
            margin  0 auto
            width 200px
            height 200px
            display block

        .croppa-container canvas
            border-radius 50%!important
</style>
