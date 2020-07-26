<template>
    <div class="stock_wrapper">
        <DbTable></DbTable>
    </div>
</template>

<script>
    import DbTable from './dbTable';

    export default {
        name: "Stock",
        components: {DbTable}
    }
</script>

<style scoped>
    @import '../assets/css/stock.css';
</style>