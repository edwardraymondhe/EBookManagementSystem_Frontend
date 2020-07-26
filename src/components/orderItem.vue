<template>
    <div class="orderItem_wrapper">
            <span class="timestamp">OrderNo: {{orderNumber}}</span>
            <span class="totalPrice">TotalPrice: {{totalPrice}}</span>
    </div>
</template>

<script>
    import Checkbox from 'vue-material-checkbox'

    export default {
        name: 'CartItem',
        props: ["itemInfo"],
        data(){
            return{
                orderNumber: this.itemInfo.purchaseId,
                timestamp: this.itemInfo.timeStamp,
                totalPrice: this.itemInfo.totalPrice,
            }
        },
        created() {
        },
        methods: {
        },
        watch:{
        },
        component:{
            Checkbox
        }
    }
</script>

<style>
    @import '../assets/css/orderItem.css';
</style>