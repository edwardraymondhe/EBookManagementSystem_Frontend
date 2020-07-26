<template>
    <div class="login_wrapper">
            <h3>#Login, for your journey of literature#</h3>
            <form class="info">
                <label>
                    <input class="username"
                           type="text"
                           placeholder="What's the reader's name?"
                           v-model="username"
                           @keyup.enter="submitInfo($event)"
                    >
                </label>
                <label>
                    <input class="password"
                           type="password"
                           placeholder="What's the reader's password?"
                           v-model="password"
                           @keyup.enter="submitInfo($event)"
                    >
                </label>
            </form>


        <button class="login" @click="submitInfo($event)">Login</button>

        <router-link class="link" to="/register">Come and share our common interest.</router-link>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "Login",
        data() {
            return {
                username: '',
                password: '',
                loginFeedBack: 0,
            }
        },
        methods: {
            submitInfo: function(event) {
                event.preventDefault();

                let _this = this;

                axios.get('http://localhost:8080/auth/login',{
                    params: {
                        username: this.username,
                        password: this.password,
                    }
                })
                .then(response => {
                    _this.loginFeedBack = response.data;

                    if(_this.loginFeedBack !== -1 && _this.loginFeedBack !== -2 && _this.loginFeedBack !== -3) {

                        alert('Welcome to Literature-World, ' + _this.username);

                        /* SAVING */

                        // // Save token
                        // _this.userToken = 'Bearer ' + _this.username;

                        // Save login status
                        localStorage.setItem('Login', 'True');

                        // Save current User Info

                        axios.get("http://localhost:8080/user/getUser", {
                            params: {
                                userId: _this.loginFeedBack
                            }
                        })
                        .then(response => {
                            this.fetchUser = JSON.stringify(response.data);
                            localStorage.setItem('User', this.fetchUser);
                            localStorage.setItem('UserId', _this.loginFeedBack);
                            localStorage.setItem('Admin', JSON.stringify(response.data.userType));
                            this.$router.push({path: `/home`});
                        });
                        /* END SAVING */

                    }else{

                        switch(_this.loginFeedBack){
                            // -1: USER NOT EXISTS
                            case -1:
                                alert("This account doesn't exist.");
                                break;

                            // -2: USER EXISTS, BUT LOCKED
                            case -2:
                                alert("Your account is locked.");
                                break;

                            // -3: USER EXISTS, PASSWORD WRONG
                            case -3:
                                alert("Your password is incorrect.");
                                break;
                        }
                        localStorage.removeItem('Login');
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        }
    }
</script>

<style>
    @import '../assets/css/login.css';
    @import '../assets/css/panel_gen.css';
</style>
