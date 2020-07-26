<template>
    <div class="content_wrapper">
        <SearchBar v-on:pass-input="passInput"/>
        <div class="content">
            <router-view :passInput="recInput"></router-view>
        </div>
        <SideNav/>
        <SideNav/>
    </div>
</template>

<script>
    import SearchBar from "./searchBar";
    import SideNav from "./sideNav";

    export default {
        name: "Main",
        components: {SideNav, SearchBar},
        methods: {
            passInput(value) {
                this.recInput = value;
                console.log("In main");
                console.log(this.recInput);
            }
        },
        data() {
            return {
                recInput: ''
            }
        }
    }

</script>

<style scoped>
    @import '../assets/css/main.css';
</style>
