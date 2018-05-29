<template>
    <div id="profile">
        <h3>Profile</h3>
        <p>Modifying your profile will be displayed on your business card and will allow more friends to get to know you.</p>
        <div class="avatar-setting">
            <img class="avatar" src="../../../../static/img/ava-default.svg">
            <el-button @click="showCroppaDia"
                       type="primary"
                       size="mini"
                       class="upload-button">
                upload new picture
            </el-button>
        </div>
        <el-form :model="profileForm"
                 :rules="rules"
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
                <el-button type="primary" @click="submitForm('changePwdForm', updatePassword)">
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

    export default {
        name: "Profile",
        data(){
            return {
                croppa: {},
                avatarDialogVisible: false,
                profileForm:{
                    name: '',
                    email: '',
                    address: '',
                    personalPage: '',
                    intro: ''
                },
                rules:{
                    name: [
                        {max: 30, message: 'name is limited in 30 characters'}
                    ],
                    email: [

                    ]
                },
            }
        },
        methods: {
            getUserDetail(){
                let url = config.JAVABASEDOMAIN + `/user/detail`;
                let succ = res => {
                    if (!res.errorMsg) {
                        console.log(res)
                    }
                };
                let fail = res => {};
                net_util.getRequest(url, {}, succ, fail)
            },
            showCroppaDia(){
                this.avatarDialogVisible = true
            },
            setNewPicture(){
                this.croppa.generateBlob((blob) => {
                    let formData = new FormData();
                    formData.append('icon', blob);
                    this.uploadImg(formData).then(res => {
                        console.log(res)
                    }).catch(res => {
                        console.log(res)
                    })
                })
            },
            uploadImg(formData){
                return new Promise((resolve, reject) => {
                    let url = config.JAVABASEDOMAIN + '/user/upload';
                    let data = formData;
                    let succ = res  => {
                        if (!res.errorMsg) {
                            resolve(res)
                        }else{
                            reject(res)
                        }
                    };
                    let fail = res => reject(res);
                    net_util.formDataRequest(url, data, succ, fail);
                })
            }
        },
        mounted(){
            this.getUserDetail()
        }
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
            .upload-button
                margin-left 10px
        .croppa
            margin  0 auto
            width 200px
            height 200px
            display block
</style>
