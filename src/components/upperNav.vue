<template>
    <div class="upperNav_user_wrapper" v-if="userType === 1">
        <img v-bind:src="Logo">
        <button>
            <router-link to="/home/bookList">Books</router-link>
        </button>
        <button>
            <router-link to="/home/cart">Cart</router-link>
        </button>
        <button>
            <router-link to="/home/order">Orders</router-link>
        </button>
        <button>
            <router-link to="/home/profile">Profile</router-link>
        </button>
        <button @click="userLogin">
            Login
        </button>
    </div>
    <div class="upperNav_admin_wrapper" v-else>
        <img v-bind:src="Logo">
        <button>
            <router-link to="/home/bookList">Books</router-link>
        </button>
        <button>
            <router-link to="/home/cart">Cart</router-link>
        </button>
        <button>
            <router-link to="/home/order">Orders</router-link>
        </button>
        <button>
            <router-link to="/home/profile">Profile</router-link>
        </button>
        <button @click="userLogin">
            Login
        </button>
        <button>
            <router-link to="/home/admin/manageUser">AUsers</router-link>
        </button>
        <button>
            <router-link to="/home/admin/manageOrder">AOrders</router-link>
        </button>
        <button>
            <router-link to="/home/admin/manageStock">AStock</router-link>
        </button>
    </div>
</template>

<script>
    import Logo from '../assets/img/logo.png';

    export default {
        name: "UpperNav",
        data() {
            return {
                Logo,
                userType: null,
            }
        },
        created(){
            this.userType = JSON.parse(localStorage.getItem('Admin'));
            console.log('userType ' + this.userType);
        },
        methods:{
            userLogin: function(event){
              event.preventDefault();
              let loginStat = localStorage.getItem('Login');
              console.log("LoginStat:");
              console.log(loginStat);
              if(loginStat === 'True') {
                  alert("You should logout first.");
              }else{
                  console.log(loginStat);
                  this.$router.push('/login');
              }
            }
        }
    }

</script>

<style scoped>
    @import '../assets/css/upperNav.css';
</style>
