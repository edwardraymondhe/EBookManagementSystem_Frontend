<template>
    <div class="cart_wrapper" v-if="items.length > 0 && sent === false && refresh === false">
<!--        Fetch bookId and returns bookInfo from books, quantity from cart-->
        <div class="bucket" :key="index" v-for="(item,index) in items">
                <label class="checkBox"><input type="checkbox"
                       :value="item.bookId"
                       v-model="checkedItems"
                       @change="check($event)"
                /></label>
                <CartItem @reCalc="reCalc" v-bind:itemInfo="item"/>

        </div>
        <div class="calc">
            <span>Bucket: {{checkedItems.length}} items</span>
            <span class="totalPrice">Total: $ {{this.totPrice}}</span>
            <button class="checkout" @click="checkout">Checkout</button>
        </div>
    </div>

    <div class="cart_wrapper" v-else-if="items.length === 0 && sent === false && refresh === false">
        <span class="warn">Go, grab as many book as you can!</span>
        <div class="calc">
            <span>Stop staring at it, it's empty...</span>
            <span class="totalPrice">Total: $ 0</span>
            <button class="checkout" @click="notDone">Checkout</button>
        </div>
    </div>

    <div class="cart_wrapper" v-else-if="sent === true || refresh === true">
        <div class="spinner"></div>
        <div class="calc">
            <span v-if="sent === true">Wrapping {{checkedItems.length}} items up...</span>
            <span v-else>Counting...</span>
            <span class="totalPrice" v-if="refresh === true">Total: $ ...</span>
            <span class="totalPrice" v-else>Total: $ {{this.totPrice}}</span>
            <button class="checkout" @click="onCalc">Calculating</button>
        </div>
    </div>
</template>

<script>
    import CartItem from './cartItem';
    import axios from "axios";

    export default {
        name: "Cart",
        data() {
            return {
                items: [],
                checkedItems:[],
                totPrice: 0,
                sent: false,
                refresh: false,
            }
        },
        created() {

            axios.get("http://localhost:8080/cart/getCart", {
                    params:{
                        userId: localStorage.getItem('UserId')
                    }
                }
            )
            .then(response => {
                let fetchCart = JSON.stringify(response.data);
                localStorage.setItem('Cart', fetchCart);
                this.items = (JSON.parse(localStorage.getItem('Cart')));
                this.reCalc(1);
            });


        },
        methods:{
            check: function(e){
                e.preventDefault();
                this.reCalc(0);
            },
            reCalc(calcType){
                if(calcType === 1) {
                    this.refresh = true;
                    setTimeout(()=>{
                        this.refresh = false;
                    },1000);
                    this.items = (JSON.parse(localStorage.getItem('Cart')));
                }

                let cartTmp = (JSON.parse(localStorage.getItem('Cart')));
                let itemsTmp = this.checkedItems;
                this.totPrice = 0;
                for(let i in itemsTmp)
                {
                    axios.get("http://localhost:8080/book/getBook",{
                        params:{
                            bookId: itemsTmp[i],
                        }
                    })
                    .then(response => {
                            for(let j in cartTmp) {
                                if (cartTmp[j].bookId === itemsTmp[i]) {
                                    this.totPrice += response.data.price * cartTmp[j].quantity;
                                    break;
                                }
                            }
                        }
                    );
                }
            },

            checkout(){
                let _this = this;

                if(_this.checkedItems.length <= 0) {
                    alert("You brought an empty bucket with you...?");
                    return;
                }

                _this.sent = true;

                let checkedItems = JSON.stringify(_this.checkedItems);
                let postData = new FormData();
                postData.append('userId', localStorage.getItem('UserId'));
                postData.append('checkedItems', checkedItems);

                axios.post("http://localhost:8080/purchase/updatePurchaseItems", postData)
                .then(response => {
                    let fetchOrder = JSON.stringify(response.data);
                    localStorage.setItem('Order', fetchOrder);

                    axios.get("http://localhost:8080/cart/getCart", {
                        params:{
                            userId: localStorage.getItem('UserId')
                        }
                    })
                    .then(response => {
                        if(response.status === 200) {
                            setTimeout(() => {
                                let fetchCart = JSON.stringify(response.data);
                                localStorage.setItem('Cart', fetchCart);
                                _this.items = (JSON.parse(localStorage.getItem('Cart')));
                                alert("Congrats, you've just ordered what you might like.");
                                _this.checkedItems = [];
                                _this.totPrice = 0;
                                _this.sent = false;
                                _this.reCalc(0);
                            }, 2000)
                        }else if(response.status === 500)
                        {
                            alert("Oops, we believe your order was more than we could afford, please try again.");
                        }
                    });
                });

            },
            onCalc(){
                alert("Don't disturb me!");
            },
            notDone(){
                alert("You know you came empty-handed, right?");
            }
        },
        components: {
            CartItem,
        }
    }
</script>

<style scoped>
    @import '../assets/css/cart.css';
    @import '../assets/css/spinner.css';
</style>
