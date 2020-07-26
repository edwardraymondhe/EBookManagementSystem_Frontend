<template>
    <div class="profile_wrapper">
        <div class="profile">
            <img class="avatar" v-bind:src="this.fetchUser.userColl.userIcon"/>
            <div class="info">
                <div class="uneditable">
                    <h2 class="name">{{this.fetchUser.name}}</h2>
                    <p class="type" v-if="this.fetchUser.userType === 2">Admin</p>
                    <p class="type" v-else>User</p>
                </div>
                <div class="editable" v-if="editing === false">
                    <h2 class="nickName">{{this.fetchUser.nickName}}</h2>
                    <p class="tel">Tel: {{this.fetchUser.tel}}</p>
                    <p class="email">E-mail: {{this.fetchUser.email}}</p>
                </div>
                <div class="editable" v-if="editing === true">
                    <label>
                    <input class="nickName"
                           type="text"
                           v-bind:placeholder= this.fetchUser.nickName
                           v-model="nickName">
                    </label>

                    <label>
                        <input class="tel"
                               type="text"
                               v-bind:placeholder= this.fetchUser.tel
                               v-model="tel">
                    </label>

                    <label>
                        <input class="email"
                               type="text"
                               v-bind:placeholder= this.fetchUser.email
                               v-model="email">
                    </label>
                </div>
<!--                <p class="bought">Bought: {{profile.bought}}</p>-->
            </div>

        </div>
        <div class="option">
            <button class="edit" @click="enableEditing" v-if="editing === false">EDIT</button>
            <button class="edit" @click="disableEditing" v-else>CANCEL</button>
            <button class="logout" @click="userLogout">
                <router-link to="/login">LOGOUT</router-link>
            </button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Profile",
        data() {
            return {
                fetchUser: (JSON.parse(localStorage.getItem('User'))),
                editing: false,
                nickName: null,
                tel: null,
                email: null,
            }
        },
        methods:{
            enableEditing: function(){
                this.editing = true;
            },
            disableEditing: function(){
                this.editing = false;
            },
            saveEdit: function(){
                // However we want to save it to the database
                this.value = this.tempValue;
                this.disableEditing();
            },
            userLogout: function(event){
                event.preventDefault();
                localStorage.clear();

                // localStorage.removeItem('User');
                // localStorage.removeItem('UserId');
                // localStorage.removeItem('Login');
                // localStorage.removeItem('Admin');
            }
        }
    }
</script>

<style scoped>
    @import '../assets/css/profile.css';
</style>
