<template>
    <div class="panel_wrapper">
        <h1 class="title">E-Book</h1>
        <router-view class="panel"></router-view>
        <div class="loginBackground"/>
    </div>
</template>

<script>
    export default {
        name: "Panel"
    }
</script>

<style>
    @import '../assets/css/panel.css';
    @import '../assets/css/panel_gen.css';
</style>