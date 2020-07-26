<template>
    <body>
    <div class="home_wrapper">
        <Header/>
        <Main/>
        <div class="backgroundImage"/>
    </div>
    </body>
</template>

<script>
    import Header from '../components/header';
    import Main from '../components/main';

    export default {
        name: 'Home',
        components: {
            Header,
            Main
        }
    }
</script>

<style scoped>
    @import '../assets/css/theme.scss';
    @import '../assets/css/home.css';
</style>