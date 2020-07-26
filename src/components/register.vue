<template>
    <div class="register_wrapper">
            <h3>#Join us, for your journey of literature#</h3>
            <form class="info">
                <label>
                    <input class="username"
                           type="text"
                           placeholder="What's the reader's name?"
                           v-model="username">
                </label>
                <label>
                    <input class="password"
                           type="password"
                           placeholder="What's the reader's password?"
                           v-model="password">
                </label>
                <label>
                    <input class="passwordRepeat"
                           type="password"
                           placeholder="Please recheck your password..."
                           v-model="passwordRepeat">
                </label>
                <label>
                    <input class="email"
                           type="email"
                           placeholder="What's the reader's email?"
                           v-model="email">
                </label>
                <span id="usernameCheck"></span><br/>
                <span id="passwordCheck"></span><br/>
                <span id="emailCheck"></span><br/>

            </form>

        <button class="register" @click="submitInfo($event)">Register</button>

        <router-link class="link" to="/login">Already got an account?</router-link>


    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        name: "Register",
        data(){
            return {
                username: '',
                password: '',
                passwordRepeat: '',
                email: '',
                fetchUser: null,
            }
        },
        methods:{
            validEmail: function (email) {
                let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },

            submitInfo: function(event){
                event.preventDefault();

                let _this = this;
                let errorFlag = false;

                if(_this.password !== _this.passwordRepeat) {
                    document.getElementById("passwordCheck").innerText = "Password unmatched.";
                    errorFlag = true;
                }
                else
                    document.getElementById("passwordCheck").innerText = '';

                if(!this.validEmail(this.email)) {
                    document.getElementById("emailCheck").innerText = "Email invalid.";
                    errorFlag = true;
                }
                else
                    document.getElementById("emailCheck").innerText = '';

                if(!errorFlag) {
                    axios.get('http://localhost:8080/auth/register', {
                        params: {
                            username: this.username,
                            password: this.password,
                            email: this.email,
                        }
                    })
                        .then(response => {
                            _this.fetchUser = response.data;
                            if (response.status === 500) {
                                document.getElementById("usernameCheck").innerText = "Username registered.";
                            } else {
                                document.getElementById("usernameCheck").innerText = '';
                                document.getElementById("passwordCheck").innerText = '';
                                document.getElementById("emailCheck").innerText = '';

                                localStorage.setItem('Login', 'True');

                                _this.fetchUser = JSON.stringify(response.data);
                                localStorage.setItem('User', this.fetchUser);
                                localStorage.setItem('UserId', (JSON.parse(localStorage.getItem('User'))).userId);
                                localStorage.setItem('Admin', (JSON.parse(localStorage.getItem('User'))).userType);
                                this.$router.push({path: `/home`});
                            }
                        });
                }
            }
        }
    }
</script>

<style>
    @import '../assets/css/register.css';
    @import '../assets/css/panel_gen.css';
</style>
