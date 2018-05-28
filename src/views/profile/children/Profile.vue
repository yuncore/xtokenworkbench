<template>
    <div id="profile">
        <h3>Profile</h3>
        <p>Modifying your profile will be displayed on your business card and will allow more friends to get to know you.</p>
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
    </div>
</template>

<script>
    export default {
        name: "Profile",
        data(){
            return {
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
</style>
